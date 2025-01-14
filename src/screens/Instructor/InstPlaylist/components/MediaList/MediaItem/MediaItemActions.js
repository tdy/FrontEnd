import React from 'react';
import { Route } from 'dva/router.js';
import cx from 'classnames';
import Button from '@material-ui/core/Button';

import {
  useButtonStyles,
  CTCheckbox,
  CTText
} from 'layout';

import { links } from 'utils';
import { CROWDEDIT_ALLOW, CROWDEDIT_FREEZE_ALL, FLASH_SET_YES ,FLASH_DETECT_YES,FLASH_SET_NO /* , FLASH_DETECT_NO,FLASH_UNKNOWN */} from 'utils/constants.js';
import UploadASLButton from './UploadASLButton.js';
import { UploadSingleFile } from '../UploadFile/index.js';


function MediaItemActions({ playlistId, mediaId, media, isUnavailable, dispatch }) {
  const btn = useButtonStyles();
  const checkboxStyles = CTCheckbox.useStyles();
  const btnClassName = cx(btn.tealLink, 'media-item-button');
  const hasASL = media.hasAsl;
  const flashWarningIsChecked = media.flashWarning === FLASH_DETECT_YES || media.flashWarning === FLASH_SET_YES;
  const crowdEdit = media.crowdEditMode !== CROWDEDIT_FREEZE_ALL;

  const handleDelete = () => {
    const confirm = {
      text: 'Are you sure you want to delete this video? (This action cannot be undone)',
      onConfirm: () => dispatch({ type: 'instplaylist/deleteMedias', payload: [mediaId] }),
    };
    dispatch({ type: 'instplaylist/setConfirmation', payload: confirm });
  };

  const handleASLDelete = () => {
    const confirm = {
      text: 'Are you sure you want to delete this media\'s ASL video? This action cannot be undone.',
      onConfirm: () => dispatch({ type: 'instplaylist/deleteASL', payload: [mediaId]}),
    };
    dispatch({ type: 'instplaylist/setConfirmation', payload: confirm});
  }

  const setEpubErrorText = () => {
    if (!media.transReady && !media.sceneDetectReady)
      return 'epub creation waiting for transcription and scene analysis to complete.';
    if (!media.transReady) return 'epub creation waiting for transcription to complete.';
    if (!media.sceneDetectReady) return 'epub creation waiting for scene analysis to complete.';
  };

  const toggleFlashWarning = () => {
    const flashWarning = flashWarningIsChecked ? FLASH_SET_NO : FLASH_SET_YES;
    dispatch({ type: 'instplaylist/setFlashingWarning', payload: {mediaId, flashWarning}});
  };
  const toggleCrowdEditing = () => {
    const crowdEditMode = crowdEdit ? CROWDEDIT_FREEZE_ALL : CROWDEDIT_ALLOW;
    dispatch({ type: 'instplaylist/setCrowdEditMode', payload: {mediaId, crowdEditMode}});
  };
  const showTranscriptionSettings = false; // This is experimental/ in development
  return (
    <div>
      <div className="media-item-actions">
        <Button
          disabled={isUnavailable}
          className={btnClassName}
          startIcon={<i className="material-icons watch">play_circle_filled</i>}
          href={links.watch(mediaId)}
        >
          Watch
        </Button>
        {showTranscriptionSettings ? (
          <Button
            className={btnClassName}
            startIcon={<i className="material-icons">text_snippet</i>}
            href={links.mspTransSettings(mediaId)}
          >
            Transcription
          </Button>
        ) : null}

        <Button
          disabled={!media.transReady || !media.sceneDetectReady}
          className={btnClassName}
          startIcon={<i className="material-icons">import_contacts</i>}
          href={links.mspEpubSettings(mediaId)}
        >
          I-Note
        </Button>

        <Button
          className={btnClassName}
          startIcon={<i className="material-icons delete">delete</i>}
          onClick={handleDelete}
        >
          delete
        </Button>
        { !hasASL &&
          <UploadASLButton playlistId={playlistId} mediaId={mediaId} /> }        
        <Route path="/playlist/:playlistId/media/:mediaId/upload-asl" component={UploadSingleFile} /> 

        { hasASL &&
          <Button
            className={btnClassName}
            startIcon={<i className="material-icons upload">delete</i>}
            onClick={handleASLDelete}
            title="Delete ASL video"
          >
            delete ASL
          </Button> }
        
        <div className='media-item-check'><CTCheckbox 
          className={checkboxStyles}
          id={`FlashWarning-${mediaId}`}
          label="Seizure risk (flashing warning)"
          checked={flashWarningIsChecked}
          onChange={toggleFlashWarning}
        />
        </div>
        
        
        <div className='media-item-check'><CTCheckbox 
          classNames={checkboxStyles}
          id={`CrowdEdit-${mediaId}`}
          label="Freeze Captions &amp; Descriptions"
          checked={!crowdEdit}
          onChange={toggleCrowdEditing}
        /> 
        </div>

      </div>
      <div>
        {!media.transReady || !media.sceneDetectReady ? (
          <CTText muted padding={[0, 0, 5, 10]}>
            {setEpubErrorText()}
          </CTText>
        ) : null}
      </div>
      
    </div>
  );
}

export default MediaItemActions;
