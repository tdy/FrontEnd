/**
 * Setting bar for screen mode inside SubHeader
 */

import React, { useState } from 'react'
// UI
import ModeSetting from './ModeSetting'
import UpNext from './UpNext'
import './index.css'

export function VideoSettingBar({propsForSettingBar, propsForUpNext}) {
  /** Listen on resizing of window to decide showing or hiding the text */
  const [isMobile, setIsMobile] = useState(window.innerWidth < 650 ? true : false)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 650) setIsMobile(() => false)
    else setIsMobile(() => true)
  })

  return (
    <div className="video-setting-bar">
      <ModeSetting {...propsForSettingBar} isMobile={isMobile} />
      <UpNext {...propsForUpNext} isMobile={isMobile} />
    </div>
  )
}
