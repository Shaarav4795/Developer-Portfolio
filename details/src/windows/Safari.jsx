import { WindowControls } from '#components'
import WindowWrapper from '#hoc/WindowWrapper'
import { ChevronLeft, ChevronRight, Copy, PanelLeft, Plus, SearchIcon, Share, ShieldHalf } from 'lucide-react'
import React from 'react'

const Safari = ({ onMinimize, onClose }) => {
  return (
    <>
      <div id='window-header' className='window-drag-handle'>
        <WindowControls target="safari" onMinimize={onMinimize} onClose={onClose} />
        <PanelLeft className='ml-10 icon' />
        <div className='flex items-center gap-1 ml-5'>
          <ChevronLeft className='icon' />
          <ChevronRight className='icon' />
        </div>
        <div className='flex-1 flex-center gap-3'>
          <ShieldHalf className='icon' />
          <div className='search'>
            <SearchIcon className='icon' />
            <input 
              type='text' 
              placeholder='Search or enter website name'
              className='flex-1'
            />
          </div>
        </div>
        <div className='flex items-center gap-5'>
          <Share className='icon' />
          <Plus className='icon' />
          <Copy className='icon' />
        </div>
      </div>
      <div className='blog'>
        <h2>
          Developer Updates
        </h2>
        <div className='space-y-6'>
          <div className='text-gray-600 text-sm'>
            No posts available right now.
          </div>
        </div>
      </div>
    </>
  )
}

const SafariWindow = WindowWrapper(Safari, 'safari')

export default SafariWindow;
