'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './collection-selector.module.scss';
import DisplayElement from '../display-element/DisplayElement';
import IconRenderer from '../../icon-renderer/IconRenderer';
import { useAppSelector } from '@/lib/state/hooks';
import { selectActiveMuralId } from '@/lib/state/slices/muralSlice';
import { useCollections } from '@/components/tabs-display/utils/useCollections';
import { useUserMurals } from '@/components/mural/utils/useUserMurals';

interface CollectionSelectorProps {
  selectedCollectionId: string;
  onSelect: (id: string) => void;
}

export function CollectionSelector({
  selectedCollectionId,
  onSelect,
}: CollectionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeMuralId = useAppSelector(selectActiveMuralId);
  const { data: userMurals, isLoading: isMuralsLoading } = useUserMurals();
  // The user's activeMuralId can be null (e.g. never set), which would leave the
  // collections query disabled forever. Fall back to the first mural.
  const muralId =
    activeMuralId ||
    userMurals?.activeMuralId ||
    userMurals?.murals[0]?.id ||
    '';
  const {
    data: collections,
    isLoading: isCollectionsLoading,
    isError: isCollectionsError,
  } = useCollections(muralId);

  useEffect(() => {
    if (collections && collections.length > 0 && !selectedCollectionId) {
      const mainCollection = collections.find((c) => c.isMain);
      onSelect(mainCollection?.id || collections[0].id);
    }
  }, [collections, selectedCollectionId, onSelect]);

  const selectedCollection =
    collections?.find((c) => c.id === selectedCollectionId) ?? collections?.[0];

  const otherCollections = collections?.filter(
    (c) => c.id !== selectedCollection?.id,
  );

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (id: string) => {
    onSelect(id);
    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (isMuralsLoading || isCollectionsLoading) {
    return (
      <div className={styles['collection-selector']}>
        <span className={styles['loading']}>Loading...</span>
      </div>
    );
  }

  if (!selectedCollection) {
    return (
      <div className={styles['collection-selector']}>
        <span className={styles['loading']}>
          {isCollectionsError ? 'Failed to load collections' : 'No collections'}
        </span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={styles['collection-selector']}
      onClick={toggleDropdown}
    >
      <DisplayElement
        iconConfig={selectedCollection.displayElement.iconConfig}
        label={selectedCollection.displayElement.content}
      />

      <div className={`${styles['chevron']} ${isOpen ? styles['open'] : ''}`}>
        <IconRenderer
          config={{ type: 'predefined', icon: 'chevronDown' }}
          renderedSize={7}
        />
      </div>

      {isOpen && (
        <div className={styles['dropdown-list']}>
          {otherCollections && otherCollections.length > 0 ? (
            otherCollections.map((collection) => (
              <div
                key={collection.id}
                className={styles['dropdown-item']}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(collection.id);
                }}
              >
                <DisplayElement
                  iconConfig={collection.displayElement.iconConfig}
                  label={collection.displayElement.content}
                />
              </div>
            ))
          ) : (
            <div className={styles['dropdown-empty']}>No more collections</div>
          )}
        </div>
      )}
    </div>
  );
}
