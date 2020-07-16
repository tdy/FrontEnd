import React from 'react';
import cx from 'classnames';
import { CTText } from 'layout';
import { epub, getCompactText } from '../../controllers';
import { connectWithRedux } from '../../redux';
import { ChapterTitle } from '../../components';
import ChapterTitleButton from './ChapterTitleButton';
import EPubListItem from './EPubListItem';
import EPubSubChapterItem from './EPubSubChapterItem';

function EPubChapterItem({
  chapter,
  chapterIndex,
  foldedIds=[],
  canUndoSplit=false,
}) {
  const fold = () => epub.ctrl.foldChapter(chapter.id);
  const unfold = () => epub.ctrl.unfoldChapter(chapter.id);

  const undoSplitChapter = () => epub.data.undoSplitChapter(chapterIndex);
  const appendChapterAsSubChapter = () => epub.data.appendChapterAsSubChapter(chapterIndex);
  const handleMouseOverChapterList = () => null// epub.data.handleMouseOverChapterList(chapter);

  const handleChapterTitleChange = value =>
    epub.data.handleChapterTitleChange(chapterIndex, value);

  const isFolded = foldedIds.includes(chapter.id);
  
  const chClasses = cx('ct-epb', 'sch', 'ch-item', 'ct-d-c', { fold: isFolded });

  return (
    <div 
      id={epub.const.chID(chapter.id)}
      className={chClasses}
      onMouseEnter={handleMouseOverChapterList}
    >
      <div className="ch-item-title-con ct-d-r-center-v">
        <ChapterTitle
          id={epub.const.chTitleID(chapter.id)}
          value={chapter.title}
          onSave={handleChapterTitleChange}
          headingType="h2"
          className="ch-item-title"
        />

        <ChapterTitleButton
          show
          content={isFolded ? 'Expand' : 'Collapse'}
          color="transparent"
          icon={isFolded ? "expand_more" : "expand_less"}
          className="ch-item-expand-btn"
          outlined={false}
          onClick={isFolded ? unfold : fold}
        />

        <ChapterTitleButton 
          show={canUndoSplit}
          content="Undo split"
          icon="unfold_less"
          className="ch-item-act-btn"
          onClick={undoSplitChapter}
        />

        <ChapterTitleButton 
          show={canUndoSplit}
          content="As a Sub-Chapter"
          icon="chevron_right"
          className="ch-item-act-btn padded-1"
          onClick={appendChapterAsSubChapter}
        />
      </div>

      {
        isFolded 
        ?
          <CTText line={2} className="ch-item-compact-txt">
            {getCompactText(chapter)}
          </CTText>
        :
          <>
            <div className="ch-item-ol ct-d-c">
              {chapter.items.map((item, itemIndex) => (
                <EPubListItem 
                  key={item.id} 
                  item={item} 
                  itemIndex={itemIndex}
                  chapterIndex={chapterIndex}
                  canSplit={itemIndex > 0}
                  canSubdivide
                />
              ))}
            </div>

            <div className="ch-item-ol ct-d-c">
              {chapter.subChapters.map((subChapter, subChapterIndex) => (
                <EPubSubChapterItem
                  key={subChapter.id}
                  foldedIds={foldedIds}
                  subChapter={subChapter}
                  chapterIndex={chapterIndex}
                  subChapterIndex={subChapterIndex}
                  canUndoSubdivide={subChapterIndex === 0}
                  canUndoSplitSubChapter={subChapterIndex > 0}
                  canSplitAsNewChapter={chapter.items.length > 0 || subChapterIndex > 0}
                />
              ))}
            </div>
          </>
      }

    </div>
  );
}

export default connectWithRedux(
  EPubChapterItem,
  ['foldedIds']
);