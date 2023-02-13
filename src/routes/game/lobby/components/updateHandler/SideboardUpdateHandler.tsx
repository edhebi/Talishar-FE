import React, { useRef } from 'react';
import { useEffect } from 'react';
import { RootState } from 'app/Store';
import {
  clearGetLobbyRefresh,
  gameLobby,
  setIsUpdateInProgressFalse
} from 'features/game/GameSlice';
import { useAppDispatch, useAppSelector } from 'app/Hooks';
import { shallowEqual } from 'react-redux';

interface LobbyUpdateHandlerProps {
  isSubmitting: boolean;
}

export const LobbyUpdateHandler = React.memo(
  ({ isSubmitting }: LobbyUpdateHandlerProps) => {
    const abortRef = useRef<AbortController>();
    const params = useAppSelector((state: RootState) => state.game.gameInfo);
    const isUpdateInProgress = useAppSelector(
      (state: RootState) => state.game.isUpdateInProgress
    );
    const dispatch = useAppDispatch();

    // setup long poll
    useEffect(() => {
      if (params.gameID == 0 || isUpdateInProgress) {
        return;
      }
      dispatch(gameLobby({ game: params, signal: abortRef.current?.signal }));
    }, [params, isUpdateInProgress, dispatch]);

    if (isSubmitting) {
      abortRef.current?.abort();
    }

    // gameID already in params
    useEffect(() => {
      abortRef.current = new AbortController();

      return () => {
        abortRef.current?.abort();
        dispatch(setIsUpdateInProgressFalse());
        dispatch(clearGetLobbyRefresh());
      };
    }, [isSubmitting]);

    return null;
  }
);

LobbyUpdateHandler.displayName = 'LobbyUpdateHandler';
export default LobbyUpdateHandler;