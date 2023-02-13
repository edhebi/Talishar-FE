import React from 'react';
import { useFormikContext } from 'formik';
import { FaExclamationCircle } from 'react-icons/fa';
import { DeckResponse } from 'interface/API/GetLobbyInfo.php';
import styles from './StickyFooter.module.css';
import classNames from 'classnames';
import { HiClipboardCopy } from 'react-icons/hi';

export type DeckSize = {
  deckSize: number;
  submitSideboard: boolean;
};

const StickyFooter = ({ deckSize, submitSideboard }: DeckSize) => {
  const { errors, values, isValid } = useFormikContext<DeckResponse>();
  let errorArray = [] as string[];
  for (const [key, value] of Object.entries(errors)) {
    errorArray.push(String(value));
  }

  const handleClipboardCopy = () => {
    navigator.clipboard.writeText(
      window.location.href.replace('lobby', 'join')
    );
  };

  const dynamicContainer = classNames(styles.dynamicContainer, 'container');

  return (
    <div className={styles.stickyFooter}>
      <div className={dynamicContainer}>
        <div className={styles.clipboardButtonHolder}>
          <button
            className={styles.buttonClass}
            onClick={handleClipboardCopy}
            type="button"
            data-tooltip="Copy invite link"
            data-placement="right"
          >
            <HiClipboardCopy />
          </button>
        </div>
        <div className={styles.footerContent}>
          <div>
            Deck {values.deck.length}/{deckSize}
          </div>
          {!isValid && (
            <div className={styles.alarm}>
              <FaExclamationCircle /> {errorArray[0]}
            </div>
          )}
        </div>
        <div className={styles.buttonHolder}>
          <button
            className={styles.buttonClass}
            type="submit"
            disabled={!errors || !submitSideboard}
            data-tooltip="Once you submit you can't change cards!"
            data-placement="left"
          >
            Submit deck
          </button>
        </div>
      </div>
    </div>
  );
};

export default StickyFooter;