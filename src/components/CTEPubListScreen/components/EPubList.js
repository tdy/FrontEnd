import React from 'react';
import ErrorTypes from 'entities/ErrorTypes';
import { links } from 'utils/links';
import { altEl, makeEl, CTFragment, CTHeading, CTText, CTList } from 'layout';
import { LanguageConstants } from '../../CTPlayer';
import { NoEPubWrapper, NoLangWrapper } from './Wrappers';
import NewEPubButton from './NewEPubButton';

export function _getEPubListItems(ePubs, onDelete) { 
  if (ePubs.length > 0) { 
    return ePubs.map(epub => {
      let lang = LanguageConstants.decode(epub.language);
      // let status = epub.isPublished ? 'Published' : 'Unpublished'
      return {
        id: epub.id,
        title: epub.title,
        icon: 'text_snippet',
        description: `${lang}`,
        link: true,
        to: links.epub(epub.id),
        target: '_blank',
        titleProps: {
          celadon: true
        },
        onDelete: onDelete(epub.id)
      }
    });
  }
}

function EPubList(props) {
  const {
    ePubs, languages, rawEPubData,
    sourceType, sourceId,
    onCreate,
    onDelete
  } = props;

  const noLang = languages.length === 0;
  const noEPub = !noLang && rawEPubData === ErrorTypes.NotFound404;
  const notFoundEPub = ePubs === ErrorTypes.NotFound404;
  const hasError = noLang || noEPub;
  const hasEPubs = !hasError && !notFoundEPub && ePubs.length > 0;

  const noLangElement = altEl(NoLangWrapper, noLang);
  const noEPubElement = altEl(NoEPubWrapper, noEPub, { sourceType, sourceId });
  const newEPubBtnElement = makeEl(NewEPubButton, { onCreate });
  const newEPubListItems = makeEl(<CTList items={_getEPubListItems(ePubs, onDelete)} />);

  return (
    <CTFragment h100 scrollY padding={[40, 0]} id="ct-epb-list">
      {noLangElement}
      {noEPubElement}

      {
        !hasError
        &&
        <CTFragment>
          {hasEPubs ? (
            <>
              <CTFragment justConBetween padding={[0, 20, 20, 30]}>
                <CTHeading as="h3" alignItCenter compact icon="library_books">
                  ePub Books
                </CTHeading>
                {newEPubBtnElement}
              </CTFragment>

              <CTFragment justConBetween padding={[0, 20, 20, 30]}>
                {newEPubListItems}
              </CTFragment>
            </>
          ) : (
            <CTFragment margin={[50, 0, 0, 0]} dFlexCol center>
              {newEPubBtnElement}
              <CTText center muted padding="10">
                Create your first ePub book
              </CTText>
            </CTFragment>
          )}
        </CTFragment>
      }
    </CTFragment>
  );
}

export default EPubList;
