'use client';

import {
  Fragment,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import {
  DndContext,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import AuthGuard from '@/components/auth-guard';
import PinCard from '@/components/resources-display/common/pin-card/PinCard';
import styles from './create-resource.module.scss';
import muralStyles from '@/components/mural/mural-container.module.scss';
import AddElement from '@/components/manage/add-element/AddElement';
import TitleVariant from '@/components/resources-display/common/pin-card/variants/title-variant/TitleVariant';
import TextVariant from '@/components/resources-display/common/pin-card/variants/text-variant/TextVariant';
import ImageVariant from '@/components/resources-display/common/pin-card/variants/image-variant/ImageVariant';
import VideoVariant from '@/components/resources-display/common/pin-card/variants/video-variant/VideoVariant';
import LinkVariant from '@/components/resources-display/common/pin-card/variants/link-variant/LinkVariant';
import DownloadVariant from '@/components/resources-display/common/pin-card/variants/download-variant/DownloadVariant';
import { VariantSelection } from '@/components/manage/add-element/AddElement';
import { apiClient } from '@/lib/api-client/apiClient';
import { useAppSelector } from '@/lib/state/hooks';
import { selectLimits } from '@/lib/state/slices/authSlice';
import { selectActiveMuralId } from '@/lib/state/slices/muralSlice';
import { useUserMurals } from '@/components/mural/utils/useUserMurals';

import { IconConfig } from '@/components/shared/icon-renderer/icon/types/app-icon';
import {
  generateNextOrder,
  generateOrderBetween,
  reassignOrders,
} from '@/lib/utils/fractional-index';
import EditorHeader from '../../_components/editor-header/EditorHeader';
import Clickable from '@/components/shared/clickable/Clickable';
import IconRenderer from '@/components/shared/icon-renderer/IconRenderer';
import ErrorBanner from '@/components/shared/error-banner/ErrorBanner';
import { VariantDragProvider } from '@/components/manage/variant-toolbar/variant-drag-context';

const GROUP_NAME_MAX_LENGTH = 45;
const DEFAULT_GROUP_NAME = 'My group';

interface EditableVariant {
  id: string;
  type: 'title' | 'text' | 'image' | 'video' | 'link' | 'download';
  order: string;
  content: string;
  src?: string;
  link?: string;
  fileName?: string;
  fileUrl?: string;
  fileSize?: number;
  isUploading?: boolean;
  uploadError?: string;
  iconConfig?: IconConfig;
}

interface EditableCard {
  variants: EditableVariant[];
}

interface SortableVariantProps {
  id: string;
  children: ReactNode;
}

/**
 * Wraps a single editable variant in a dnd-kit sortable item. The drag can only
 * be started from the toolbar's handle, whose props are shared with the variant
 * through VariantDragProvider (useSortable's listeners/attributes are not spread
 * on the item itself).
 */
function SortableVariant({ id, children }: SortableVariantProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      className={styles['variant-item']}
      style={{
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <VariantDragProvider
        value={{ attributes, listeners, setActivatorNodeRef }}
      >
        {children}
      </VariantDragProvider>
    </div>
  );
}

interface SortableCardProps {
  index: number;
  itemIds: string[];
  children: ReactNode;
}

/**
 * A droppable drop target for one pin card. Its SortableContext holds the
 * variant ids of that card, so variants can be sorted within, and dragged
 * across, cards.
 */
function SortableCard({ index, itemIds, children }: SortableCardProps) {
  const { setNodeRef } = useDroppable({
    id: `card-${index}`,
    data: { type: 'card', index },
  });

  return (
    <div ref={setNodeRef}>
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </div>
  );
}

export default function CreateResourcePage() {
  const [cards, setCards] = useState<EditableCard[]>([{ variants: [] }]);
  const [isPublishing, setIsPublishing] = useState(false);
  const limits = useAppSelector(selectLimits);
  const activeMuralId = useAppSelector(selectActiveMuralId);
  const { data: userMurals } = useUserMurals();
  const router = useRouter();

  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('');
  const [groupName, setGroupName] = useState(DEFAULT_GROUP_NAME);
  const [isEditingGroupName, setIsEditingGroupName] = useState(false);
  const [groupNameDraft, setGroupNameDraft] = useState(DEFAULT_GROUP_NAME);

  const startEditingGroupName = () => {
    setGroupNameDraft(groupName);
    setIsEditingGroupName(true);
  };

  const commitGroupName = () => {
    setGroupName(groupNameDraft.trim() || DEFAULT_GROUP_NAME);
    setIsEditingGroupName(false);
  };

  const handleGroupNameKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitGroupName();
    } else if (e.key === 'Escape') {
      setIsEditingGroupName(false);
    }
  };

  const updateVariant = (
    id: string,
    updater: (variant: EditableVariant) => EditableVariant,
  ) => {
    setCards((prev) =>
      prev.map((card) => ({
        ...card,
        variants: card.variants.map((v) => (v.id === id ? updater(v) : v)),
      })),
    );
  };

  const updateCardVariants = (
    cardIndex: number,
    updater: (variants: EditableVariant[]) => EditableVariant[],
  ) => {
    setCards((prev) =>
      prev.map((card, index) =>
        index === cardIndex
          ? { ...card, variants: updater(card.variants) }
          : card,
      ),
    );
  };

  const handleAddCard = () => {
    setCards((prev) => [...prev, { variants: [] }]);
  };

  const handleAddVariant = (cardIndex: number, selection: VariantSelection) => {
    if (typeof selection === 'object' && selection.type === 'integration') {
      console.log('Integration variant:', selection.platform);
      return;
    }

    const type = selection as
      | 'title'
      | 'text'
      | 'image'
      | 'video'
      | 'link'
      | 'download';

    updateCardVariants(cardIndex, (variants) => {
      // Get smallest existing order to prepend new variant at top
      const sortedVariants = [...variants].sort((a, b) =>
        a.order.localeCompare(b.order),
      );
      const firstOrder = sortedVariants[0]?.order || null;
      const newOrder = generateOrderBetween(null, firstOrder);

      const newVariant: EditableVariant = {
        id: crypto.randomUUID(),
        type,
        order: newOrder,
        content: '',
      };

      return [newVariant, ...variants];
    });
  };

  const handleVariantChange = (id: string, content: string) => {
    updateVariant(id, (v) => ({ ...v, content }));
  };

  const handleLinkChange = (id: string, link: string) => {
    updateVariant(id, (v) => ({ ...v, link }));
  };

  const handleFileChange = (
    id: string,
    fileName: string,
    fileUrl: string,
    fileSize: number,
  ) => {
    updateVariant(id, (v) => ({ ...v, fileName, fileUrl, fileSize }));
  };

  const handleToggleVariant = (id: string) => {
    updateVariant(id, (v) => ({
      ...v,
      type: v.type === 'title' ? 'text' : 'title',
    }));
  };

  const handleImageUpload = async (id: string, file: File) => {
    // Set uploading state
    updateVariant(id, (v) => ({
      ...v,
      isUploading: true,
      uploadError: undefined,
    }));

    try {
      const result = await apiClient.storage.uploadImage(file);

      if (result.success) {
        updateVariant(id, (v) => ({
          ...v,
          src: result.data.publicUrl,
          isUploading: false,
        }));
      } else {
        console.error('Upload failed:', result.message);
        updateVariant(id, (v) => ({
          ...v,
          isUploading: false,
          uploadError: 'Upload failed, try again',
        }));
      }
    } catch (error) {
      console.error('Upload error:', error);
      updateVariant(id, (v) => ({
        ...v,
        isUploading: false,
        uploadError: 'Upload failed, try again',
      }));
    }
  };

  const handleVideoUpload = async (id: string, file: File) => {
    updateVariant(id, (v) => ({
      ...v,
      isUploading: true,
      uploadError: undefined,
    }));

    try {
      const result = await apiClient.storage.uploadVideo(file);

      if (result.success) {
        updateVariant(id, (v) => ({
          ...v,
          src: result.data.publicUrl,
          isUploading: false,
        }));
      } else {
        console.error('Video upload failed:', result.message);
        updateVariant(id, (v) => ({
          ...v,
          isUploading: false,
          uploadError: 'Upload failed, try again',
        }));
      }
    } catch (error) {
      console.error('Video upload error:', error);
      updateVariant(id, (v) => ({
        ...v,
        isUploading: false,
        uploadError: 'Upload failed, try again',
      }));
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const findCardIndexByVariant = (id: UniqueIdentifier) =>
    cards.findIndex((card) => card.variants.some((v) => v.id === id));

  const parseCardId = (id: UniqueIdentifier): number | null => {
    const value = String(id);
    return value.startsWith('card-') ? Number(value.slice(5)) : null;
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeCardIndex = findCardIndexByVariant(activeId);
    const overCardIndex = parseCardId(overId) ?? findCardIndexByVariant(overId);

    if (activeCardIndex === -1 || overCardIndex === -1) return;
    if (activeCardIndex === overCardIndex) return;

    setCards((prev) => {
      const activeCard = prev[activeCardIndex];
      const overCard = prev[overCardIndex];
      const activeVariant = activeCard.variants.find((v) => v.id === activeId);
      if (!activeVariant) return prev;

      const overIndex = overCard.variants.findIndex((v) => v.id === overId);
      const translated = active.rect.current.translated;
      const isBelow =
        translated != null && translated.top > over.rect.top + over.rect.height;
      const newIndex =
        overIndex === -1 ? overCard.variants.length : overIndex + (isBelow ? 1 : 0);

      const next = [...prev];
      next[activeCardIndex] = {
        ...activeCard,
        variants: reassignOrders(
          activeCard.variants.filter((v) => v.id !== activeId),
        ),
      };

      const overVariants = [...overCard.variants];
      overVariants.splice(newIndex, 0, activeVariant);
      next[overCardIndex] = {
        ...overCard,
        variants: reassignOrders(overVariants),
      };

      return next;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeCardIndex = findCardIndexByVariant(activeId);
    const overCardIndex = parseCardId(overId) ?? findCardIndexByVariant(overId);

    if (activeCardIndex === -1 || overCardIndex === -1) return;
    if (activeCardIndex !== overCardIndex) return;

    setCards((prev) => {
      const card = prev[activeCardIndex];
      const oldIndex = card.variants.findIndex((v) => v.id === activeId);
      const newIndex = card.variants.findIndex((v) => v.id === overId);
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
        return prev;
      }

      const next = [...prev];
      next[activeCardIndex] = {
        ...card,
        variants: reassignOrders(arrayMove(card.variants, oldIndex, newIndex)),
      };
      return next;
    });
  };

  const handleDelete = (id: string) => {
    setCards((prev) =>
      prev.map((card) => ({
        ...card,
        variants: card.variants.filter((v) => v.id !== id),
      })),
    );
  };

  const isVariantInvalid = (v: EditableVariant): boolean => {
    switch (v.type) {
      case 'title':
      case 'text':
        return !v.content.trim();
      case 'image':
      case 'video':
        return !v.src || !!v.isUploading;
      case 'link':
        return !v.content.trim() || !v.link;
      case 'download':
        return !v.content.trim() || !v.fileUrl;
      default:
        return false;
    }
  };

  // A card is invalid when it has no variants or any variant has errors
  const hasErrors =
    cards.length === 0 ||
    cards.some(
      (card) =>
        card.variants.length === 0 || card.variants.some(isVariantInvalid),
    );

  const hasAttachmentErrors = cards.some((card) =>
    card.variants.some(isVariantInvalid),
  );

  const renderVariant = (variant: EditableVariant) => {
    if (variant.type === 'title') {
      return (
        <TitleVariant
          content={variant.content}
          editable
          maxLength={limits?.title_variant_max_length}
          onChange={(value) => handleVariantChange(variant.id, value)}
          onToggle={() => handleToggleVariant(variant.id)}
          onDelete={() => handleDelete(variant.id)}
        />
      );
    }

    if (variant.type === 'image') {
      return (
        <ImageVariant
          src={variant.src}
          isEditing={true}
          isUploading={variant.isUploading}
          uploadError={variant.uploadError}
          maxFileSize={limits?.image_size_limit}
          onFileSelect={(file) => handleImageUpload(variant.id, file)}
          onClearImage={() =>
            updateVariant(variant.id, (v) => ({ ...v, src: undefined }))
          }
          onDelete={() => handleDelete(variant.id)}
        />
      );
    }

    if (variant.type === 'video') {
      return (
        <VideoVariant
          src={variant.src}
          isEditing={true}
          isUploading={variant.isUploading}
          uploadError={variant.uploadError}
          maxFileSize={limits?.video_size_limit}
          onFileSelect={(file) => handleVideoUpload(variant.id, file)}
          onClearVideo={() =>
            updateVariant(variant.id, (v) => ({ ...v, src: undefined }))
          }
          onDelete={() => handleDelete(variant.id)}
        />
      );
    }

    if (variant.type === 'link') {
      return (
        <LinkVariant
          iconConfig={
            variant.iconConfig || {
              type: 'predefined',
              icon: 'link',
            }
          }
          content={variant.content}
          link={variant.link || ''}
          isEditing={true}
          maxPreviewSize={limits?.image_size_limit}
          onContentChange={(value) => handleVariantChange(variant.id, value)}
          onLinkChange={(value) => handleLinkChange(variant.id, value)}
          onIconConfigChange={(config) =>
            updateVariant(variant.id, (v) => ({ ...v, iconConfig: config }))
          }
          onDelete={() => handleDelete(variant.id)}
        />
      );
    }

    if (variant.type === 'download') {
      return (
        <DownloadVariant
          iconConfig={
            variant.iconConfig || {
              type: 'predefined',
              icon: 'fileDown',
            }
          }
          content={variant.content}
          fileUrl={variant.fileUrl || ''}
          fileName={variant.fileName || ''}
          fileSize={variant.fileSize || 0}
          isEditing={true}
          maxFileSize={limits?.file_size_limit}
          maxPreviewSize={limits?.image_size_limit}
          onContentChange={(value) => handleVariantChange(variant.id, value)}
          onFileChange={(fileName, fileUrl, fileSize) =>
            handleFileChange(variant.id, fileName, fileUrl, fileSize)
          }
          onIconConfigChange={(config) =>
            updateVariant(variant.id, (v) => ({ ...v, iconConfig: config }))
          }
          onDelete={() => handleDelete(variant.id)}
        />
      );
    }

    return (
      <TextVariant
        content={variant.content}
        editable
        maxLength={limits?.text_variant_max_length}
        onChange={(value) => handleVariantChange(variant.id, value)}
        onToggle={() => handleToggleVariant(variant.id)}
        onDelete={() => handleDelete(variant.id)}
      />
    );
  };

  const buildVariantsPayload = (cardVariants: EditableVariant[]) =>
    reassignOrders(cardVariants).map((v) => {
      let config;

      switch (v.type) {
        case 'title':
          config = { type: 'title' as const, content: v.content };
          break;
        case 'text':
          config = { type: 'text' as const, content: v.content };
          break;
        case 'image':
          config = { type: 'image' as const, src: v.src! };
          break;
        case 'video':
          config = { type: 'video' as const, src: v.src! };
          break;
        case 'link':
          config = {
            type: 'link' as const,
            content: v.content,
            src: v.link!,
            iconConfig: v.iconConfig || {
              type: 'predefined' as const,
              icon: 'link',
            },
          };
          break;
        case 'download':
          config = {
            type: 'download' as const,
            content: v.content,
            src: v.fileUrl!,
            iconConfig: v.iconConfig || {
              type: 'predefined' as const,
              icon: 'fileDown',
            },
            fileName: v.fileName!,
            fileSize: v.fileSize!,
          };
          break;
        default:
          throw new Error(`Unknown variant type: ${v.type}`);
      }

      return { order: v.order, config };
    });

  const handleBack = () => {
    const mural =
      userMurals?.murals.find((m) => m.id === activeMuralId) ??
      userMurals?.murals[0];

    if (mural) {
      router.push(`/${mural.name}`);
    } else {
      router.push('/dashboard');
    }
  };

  const handlePublish = async () => {
    if (hasErrors || isPublishing || !selectedCollectionId) return;

    setIsPublishing(true);

    try {
      let result;

      if (cards.length > 1) {
        let pinOrder = 'a0';

        const pins = cards.map((card, index) => {
          if (index > 0) {
            pinOrder = generateNextOrder(pinOrder);
          }

          return {
            order: pinOrder,
            variants: buildVariantsPayload(card.variants),
          };
        });

        result = await apiClient.resources.createPinGroupResource(
          selectedCollectionId,
          {
            groupName,
            pins,
          },
        );
      } else {
        result = await apiClient.resources.createPinResource(
          selectedCollectionId,
          {
            variants: buildVariantsPayload(cards[0]?.variants || []),
          },
        );
      }

      if (result.success) {
        const mural = userMurals?.murals.find((m) => m.id === activeMuralId);

        if (mural) {
          router.push(`/${mural.name}?coll=${selectedCollectionId}`);
        } else {
          router.push('/dashboard');
        }
      } else {
        console.error('Failed to create resource:', result.message);
      }
    } catch (error) {
      console.error('Publish error:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <AuthGuard>
      <main className={styles['page-container']}>
        <div
          className={`${muralStyles['mural-container']} ${styles['mural-container-wrapper']}`}
        >
          <EditorHeader
            onPublish={handlePublish}
            isPublishing={isPublishing}
            hasErrors={hasErrors}
            onBack={handleBack}
            errorBanner={
              hasAttachmentErrors ? (
                <ErrorBanner message="Fix the errors below" />
              ) : null
            }
          />
          <div className={styles['editor-content']}>
            <div className={styles['coll-selector-container']}>
              <Clickable
                payload={{
                  iconConfig: { type: 'predefined', icon: 'chevronDown' },
                }}
                config={{
                  clickableType: 'collection-selector',
                  selectedCollectionId,
                  onSelect: setSelectedCollectionId,
                }}
              />
            </div>
            <div className={styles['cards-group']}>
              {cards.length > 1 && (
                <div className={styles['group-header']}>
                  <div className={styles['initial-line']}>
                    <span className={styles['head']} />
                    <span className={styles['line']} />
                  </div>
                  <div className={styles['group-name-container']}>
                    {isEditingGroupName ? (
                      <input
                        className={styles['group-name-input']}
                        value={groupNameDraft}
                        onChange={(e) => setGroupNameDraft(e.target.value)}
                        onBlur={commitGroupName}
                        onKeyDown={handleGroupNameKeyDown}
                        maxLength={GROUP_NAME_MAX_LENGTH}
                        autoFocus
                      />
                    ) : (
                      <button
                        type="button"
                        className={styles['group-name-button']}
                        onClick={startEditingGroupName}
                      >
                        <span className={styles['group-name']}>
                          {groupName}
                        </span>
                        <span className={styles['edit-icon']}>
                          <IconRenderer
                            config={{ type: 'predefined', icon: 'pencil' }}
                            renderedSize={4}
                          />
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              )}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
              >
                {cards.map((card, cardIndex) => (
                  <Fragment key={cardIndex}>
                    {cardIndex > 0 && <div className={styles['pin-line']} />}
                    <SortableCard
                      index={cardIndex}
                      itemIds={card.variants.map((v) => v.id)}
                    >
                      <PinCard variants={[]}>
                        <AddElement
                          label="Add content"
                          onSelect={(selection) =>
                            handleAddVariant(cardIndex, selection)
                          }
                        />
                        {card.variants.map((variant) => (
                          <SortableVariant key={variant.id} id={variant.id}>
                            {renderVariant(variant)}
                          </SortableVariant>
                        ))}
                      </PinCard>
                    </SortableCard>
                  </Fragment>
                ))}
              </DndContext>
            </div>
            <AddElement label="Add card" onAction={handleAddCard} />
          </div>
        </div>
      </main>
    </AuthGuard>
  );
}
