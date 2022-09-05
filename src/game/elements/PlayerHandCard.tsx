import React, { useRef, useState, useEffect } from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { clearPopUp, setPopUp } from '../../features/game/GameSlice';
import { RootState } from '../../app/Store';
import Card from '../../features/Card';
import styles from '../zones/PlayerHand.module.css';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';

const HandCurvatureConstant = 8;
const ScreenPercentageForCardPlayed = 0.25;

export interface handCard {
  card?: Card;
  isArsenal?: boolean;
  isGraveyard?: boolean;
  isBanished?: boolean;
  handSize: number;
  cardIndex: number;
}

function lerp(start: number, end: number, amt: number) {
  return (1 - amt) * start + amt * end;
}

export default function PlayerHandCard(props: handCard) {
  const [controlledPosition, setControlledPosition] = useState({ x: 0, y: 0 });
  const [canPopUp, setCanPopup] = useState(true);
  // const [cardPlayMessage, setCardPlayMessage] = useState(false);
  const [dragging, setDragging] = useState(false);
  const { card, cardIndex, handSize, isArsenal, isBanished, isGraveyard } =
    props;
  if (card === undefined) {
    return <div className={styles.handCard}></div>;
  }
  const src = `https://www.fleshandbloodonline.com/FaBOnline2/WebpImages/${card.cardNumber}.webp`;
  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const onDragStop = (e: DraggableEvent, data: DraggableData) => {
    if (data.lastY < -window.innerHeight * ScreenPercentageForCardPlayed) {
      console.log('playing the card');
    }
    setControlledPosition({ x: 0, y: 0 });
    setCanPopup(true);
    setDragging(false);
  };

  const onDrag = () => {
    dispatch(clearPopUp());
    setCanPopup(false);
    setDragging(true);
  };

  const handleMouseEnter = () => {
    if (ref.current === null || !canPopUp) {
      return;
    }
    const rect = ref.current.getBoundingClientRect();
    const xCoord = rect.left < window.innerWidth / 2 ? rect.right : rect.left;
    const yCoord = rect.top < window.innerHeight / 2 ? rect.bottom : rect.top;
    dispatch(
      setPopUp({
        cardNumber: card.cardNumber,
        xCoord: xCoord,
        yCoord: yCoord
      })
    );
  };

  const handleMouseLeave = () => {
    dispatch(clearPopUp());
  };

  const degree = handSize > 1 ? lerp(-15, 15, cardIndex / (handSize - 1)) : 0;

  const yDisplace = () => {
    if (ref.current === null) {
      return 0;
    }
    const displacement = Math.sin((cardIndex / (handSize - 1)) * Math.PI);
    const rect = ref.current.getBoundingClientRect();
    const yTranslate = lerp(
      0,
      (rect.bottom - rect.top) / HandCurvatureConstant,
      -displacement
    );
    return yTranslate;
  };

  const [translation, setTranslation] = useState({
    transform: `translateY(${yDisplace()}px) rotate(${degree}deg) `
  });

  useEffect(() => {
    if (dragging) {
      setTranslation({
        transform: `translateY(${yDisplace()}px) rotate(0deg) `
      });
    } else {
      setTranslation({
        transform: `translateY(${yDisplace()}px) rotate(${degree}deg) `
      });
    }
  }, [dragging]);

  return (
    <div className={styles.handCard}>
      <Draggable
        defaultPosition={{ x: 0, y: 0 }}
        onStop={onDragStop}
        onDrag={onDrag}
        position={controlledPosition}
      >
        <div>
          <div
            className={styles.imgContainer}
            onMouseEnter={() => handleMouseEnter()}
            onMouseLeave={() => handleMouseLeave()}
            ref={ref}
            style={translation}
          >
            <div>
              <img src={src} className={styles.img} draggable="false" />
              <div className={styles.iconCol}>
                {isArsenal === true && (
                  <div className={styles.arsenal}>
                    <i className="fa fa-random" aria-hidden="true"></i>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Draggable>
    </div>
  );
}