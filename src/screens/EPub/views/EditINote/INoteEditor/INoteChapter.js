import { CTFragment, CTText, altEl} from 'layout'
import React, {useState} from 'react' 
import { Button } from 'pico-ui';
import { connect } from 'dva'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from '@material-ui/core';
import { EPubImageData } from 'entities/EPubs';
import { timestr } from 'utils';
import { ChapterImage, ChapterText, ChapterTitle, MDEditorModal } from '../../../components';
import {epub as epubTools} from '../../../controllers';

function INoteChapter ({
  chapter, 
  chIdx,
  // canSplitSubChapter = true,
  // canSubdivide = true,
  images,
  epub,
  // _isSubChapter,
  // _subChIdx,
  // _condition,
  dispatch 
}) {
  const { start, end, title } = chapter;
  // const btnStyles = useButtonStyles();
  const startTimeStr = timestr.toPrettierTimeString(start);
  const endTimeStr = timestr.toPrettierTimeString(end);
  const [insertType, setInsertType] = useState(null);
  const openMDEditor = insertType === 'md';
  const [openModalIndex, setOpenModalIndex] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenMDEditor = (itemIdx) => {
    setInsertType('md');
    setOpenModalIndex(itemIdx)
  };
      
  const watchInPlayer = () => {
    dispatch({
      type: 'epub/openPlayer', payload: {
        title: `Chapter ${chIdx + 1}: ${title}`, start, end
      }
    });
  };

  const handleClose = () => {
    setInsertType(null);
  }

  const onInsert = (index) => (val) => {
    dispatch({
      type: 'epub/updateEpubData', payload: {
        action: 'insertChapterContentAtChapterIdx', payload: { contentIdx: index, chapterIdx: chIdx, value: val }
      }
    })
  };


  const handleSave = (val) => {
    if (typeof onInsert === 'function' && val) {
      onInsert(openModalIndex)(val);
    }
    handleClose();
  };
    
   
  const handleSaveImage = (itemIdx) => (val) => {
    let imageval = new EPubImageData(val).toObject();
    if (typeof onInsert === 'function' && imageval) {
      onInsert(itemIdx)(imageval);
    }
  };

  const handleOpenImgPicker = (itemIdx) => {
    const imgData = {
      screenshots: images,
      onSave: handleSaveImage(itemIdx),
      chapterScreenshots: epub.chapters[chIdx].allImagesWithIn
    };

    dispatch({ type: 'epub/setImgPickerData', payload: imgData });
  }

  // Split and Merge Chapter Button and Functions
  const sliceChapter = (itemIdx) => dispatch({
    type: 'epub/updateEpubData', payload: {
      action: 'sliceChapter', payload: { chapterIdx: chIdx, itemIdx }
    }
  });

  // Undo Chapter Split 
  const mergeChapter = () => dispatch({
    type: 'epub/updateEpubData', payload: {
      action: 'mergeChapter', payload: { chapterIdx: chIdx }
    }
  })


  // Buttons and onClick Functions 
  const btnProps = {
    round: true,
    uppercase: true,
    classNames: 'item-action-btn',
    color: 'teal transparent'
  };

  // Split Button 
  const splitBtnElement = (itemIdx) => {
    let canSplit = itemIdx > 0
    return altEl(Button, canSplit, {
      ...btnProps,
      text: 'Split Chapter',
      icon: 'unfold_more',
       onClick: () => sliceChapter(itemIdx)
  })};
 

  const mergeChapterBtnElement = (itemIdx) => {
    let canMerge = chIdx > 0 && itemIdx === 0;
    return altEl(Button, canMerge, {
      ...btnProps,
      text: 'Merge Chapter With Above',
      icon: 'unfold_less',
      onClick: mergeChapter
  })};

  // Add Image Button
  const addImgElement = (itemIdx) => {
    return altEl(Button, true, {
      ...btnProps,
      text: 'Add Image',
      icon: 'image',
      onClick: () => handleOpenImgPicker(itemIdx)
  })};

  // Add Text Button 
  function addTextElement(itemIdx) {
    return altEl(Button, true, {
      ...btnProps,
      text: 'Add Text',
      icon: 'add',
      onClick: () => handleOpenMDEditor(itemIdx)
  })};

  function watchVideoElement(itemIdx) {
    return altEl(Button, itemIdx === 0, {
      ...btnProps,
      text: <span className="ml-1">Watch {startTimeStr} - {endTimeStr}</span>,
      icon: <span className="material-icons">play_circle_filled</span>,
      onClick: watchInPlayer
  })};

  // New Subchapter Button 
  // There is another splitSChBtnElement function in EpubListItem.js !?
  // This one does not seem to be used anywhere
  // const splitSChBtnElement = () => {
  //   return altEl(Button, canSplitSubChapter, {
  //     ...btnProps,
  //     text: 'New Sub-Chapter',
  //     icon: 'subdirectory_arrow_right',
  //     // onClick: splitSubChapter
  // })};

  // Subdivide Button 
  // There is another implementation in EPubListItem!?
  // This one does not seem to be used anywhere
  // eslint-disable-next-line no-unused-vars
  // const subdivideBtnElement = () => {
  //   return altEl(Button, canSubdivide, {
  //     ...btnProps,
  //     text: 'subdivide',
  //     icon: 'subdirectory_arrow_right',
  //     // onClick: subdivideChapter
  // })};

  // DISPATCH FUNCTIONS 
  // Save Chapter Title Handler 
  const saveChapterTitle = (value) =>
    dispatch({
      type: 'epub/updateEpubData', payload: {
        action: 'saveChapterTitle', payload: { chapterIdx: chIdx, value }
    }
  })

  // Chapter Image Functions
  const onImageChange = (index) => (val) => {
    dispatch({
      type: 'epub/updateEpubData', payload: {
        action: 'setChapterContentAtChapterIdx', payload: { chapterIdx: chIdx, contentIdx: index, value: val, type: 'image' }
      }
    })
  };

  const onTextChange = (index) => (val) => {  
    dispatch({
      type: 'epub/updateEpubData', payload: {
        action: val ? 'setChapterContentAtChapterIdx' : 'removeChapterContentAtChapterIdx', payload: { chapterIdx: chIdx, contentIdx: index, value: val }
      }
    })
  };

  const onRemove = (index) => () => {
    setDialogOpen(true);
    setOpenModalIndex(index)
  };
  const handleNo = () => {
    setDialogOpen(false);
  };
  const handleYes = () => {
    dispatch({
      type: 'epub/updateEpubData', payload: {
        action: 'removeChapterContentAtChapterIdx', payload: { chapterIdx: chIdx, contentIdx: openModalIndex, type: 'image' }
      }
    });
    setDialogOpen(false);
  };

  return (
    <CTFragment dFlexCol>
      <CTFragment 
        id={epubTools.id.chID(chapter.id)}
        className='ct-inote-chapter'
      >
        <CTFragment className='chapter-title'>
          <CTText muted className="pt-2 pl-2">Chapter {chIdx + 1}: {chapter.title}</CTText>
          <CTFragment className="ch-item-title-con ct-d-r-center-v">
            <ChapterTitle
              id={epubTools.id.chTitleID(chapter.id)}
              value={chapter.title}
              onSave={saveChapterTitle}
              headingType="h2"
              className="ch-item-title"
            />
          </CTFragment>
        </CTFragment>
       

        {chapter.contents.length === 0 ? ( 
          // If the chapter doesn't have any element, still add a button bar to it for appending
          <CTFragment className="item-actions">
            {mergeChapterBtnElement(0)}
            {splitBtnElement(0)}
            {addImgElement(0)}
            {addTextElement(0)}
            {/* watchVideoElement(0) */}
          </CTFragment>
        
        ) : (// If the chapter has elements, then iterate through all of them
          chapter.contents.map((content, itemIdx) => (
            <CTFragment key={itemIdx}>
              <CTFragment className="item-actions">
                {mergeChapterBtnElement(itemIdx)}
                {splitBtnElement(itemIdx)}
                {addImgElement(itemIdx)}
                {addTextElement(itemIdx)}
                {watchVideoElement(itemIdx)}
              </CTFragment>

              {typeof content === "object" ? ( // image
                <CTFragment className='img-con'>   
                  <ChapterImage 
                    id={`ch-content-${chapter.id}-${itemIdx}`}
                    image={content} // TODO ITEM id and ocr and alttext maybe map between item and content 
                    enableChapterScreenshots
                    onChooseImage={onImageChange(itemIdx)}
                    onRemoveImage={onRemove(itemIdx)}
                  />
                  <Dialog
                    open={dialogOpen}
                    onClose={handleNo}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      Delete Image Block
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        Do you want to delete the Image Block?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleNo} autoFocus>NO</Button>
                      <Button onClick={handleYes}>YES</Button>
                    </DialogActions>
                  </Dialog> 
                </CTFragment> 
            ) : ( // text 
              <CTFragment className='item-text'>   
                <ChapterText  
                  id={`ch-content-${chapter.id}-${itemIdx}`}
                  text={content}
                  onSaveText={onTextChange(itemIdx)}
                />
              </CTFragment>  
          )}  
              {itemIdx === chapter.contents.length - 1 && ( 
              <CTFragment className="item-actions">
                {mergeChapterBtnElement(chapter.contents.length)}
                {splitBtnElement(chapter.contents.length)}
                {addImgElement(chapter.contents.length)}
                {addTextElement(chapter.contents.length)}
                {watchVideoElement(chapter.contents.length)}
              </CTFragment>)}
            </CTFragment>
        )))}
      </CTFragment>

      {insertType !== null && (
        <MDEditorModal
          show={openMDEditor}
          onClose={handleClose}
          onSave={handleSave}
          title="Insert New Text"
        />
      )}     
    </CTFragment>
  )
}

export default connect(({ epub: { epub, images } }) => ({
 images, epub
}))(INoteChapter);
