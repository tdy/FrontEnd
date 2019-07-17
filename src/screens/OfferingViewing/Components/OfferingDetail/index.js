/**
 * Offering detail screen for a offering
 * - contains offering info and playlists
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { Icon, Divider } from 'semantic-ui-react'
import { handleData, api } from '../../../../util'
import './index.css'

export function OfferingDetail({offerings, id, history}) {
  if (!offerings.length || !id) return null
  const { offering, courses } = handleData.findById(offerings, id)
  if (!offering) return null
  const { termName, sectionName } = offering
  if (!termName) return null
  const fullNumber = api.getFullNumber(courses)
  const { description, courseName } = courses[0]
    
  return (
    <div className="offering-detail" >
      <div className="goback-container">
        <Link className="del-icon" onClick={() => history.goBack()}>
          <Icon name="chevron left" /> Go Back
        </Link>
      </div>
      <h1>{fullNumber}</h1><br/><br/>
      <h2>
        {courseName}&emsp;
        <span>{termName}&ensp;{sectionName}</span>
      </h2><br/>
      <h5>{description}</h5><br/><br/>
      <Divider />
      <h4>Playlists</h4>
    </div>
  )
}