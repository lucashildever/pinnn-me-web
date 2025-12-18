import styles from './options-button.module.scss';
import IconRenderer from '@/components/shared/icon-renderer/IconRenderer';

interface OptionsButtonProps {
  top?: number;
  right?: number;
}

export default function OptionsButton({
  top = 0,
  right = 0,
}: OptionsButtonProps) {
  const classes = [
    styles['options-button'],
    styles[`top-${top}`],
    styles[`right-${right}`],
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      <IconRenderer
        config={{ type: 'predefined', icon: 'options' }}
        renderedSize={7}
      />
    </div>
  );
}
