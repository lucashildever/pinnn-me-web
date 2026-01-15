'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './collection-selector.module.scss';
import DisplayElement from '../display-element/DisplayElement';
import IconRenderer from '../../icon-renderer/IconRenderer';
import { Clickable as IClickable } from '@/components/shared/clickable/types/clickable';
import { CollectionSelectorConfig } from '@/components/shared/clickable/types/clickableConfig';

interface CollectionSelectorProps {
  payload: IClickable;
  config: CollectionSelectorConfig;
  style?: React.CSSProperties;
}

export function CollectionSelector({
  payload,
  config,
  style,
}: CollectionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (id: string) => {
    config.onSelect(id);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
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

  return (
    <div
      ref={containerRef}
      className={styles['collection-selector']}
      style={style}
      onClick={toggleDropdown}
    >
      <DisplayElement iconConfig={payload.iconConfig} label={payload.content} />

      <div className={`${styles['chevron']} ${isOpen ? styles['open'] : ''}`}>
        <IconRenderer
          config={{ type: 'predefined', icon: 'chevronDown' }}
          renderedSize={4}
        />
      </div>

      {isOpen && (
        <div className={styles['dropdown-list']}>
          {config.items.map((item) => (
            <div
              key={item.id}
              className={styles['dropdown-item']}
              onClick={(e) => {
                e.stopPropagation(); // Prevent toggling the dropdown again
                handleSelect(item.id);
              }}
            >
              <DisplayElement
                iconConfig={item.payload.iconConfig}
                label={item.payload.content}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
