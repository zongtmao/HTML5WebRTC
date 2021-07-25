const Constants = {
    Commands: {
      START_UP: 'StartUp',
      MOUNT_VUE_APP: 'mountVueApp',
      RECORD_SCREEN: 'recordScreen',
      RECORD_SCREEN_STARTED: 'recordScreenStarted',
      RECORD_SCREEN_STOPPED: 'recordScreenStopped',
      RECORDED_VIDEOS_RELOADED: 'recordedVideosReloaded',
      RENAME_VIDEO: 'renameVideo',
      RELOAD_VIDEOS: 'reloadVideos',
      EXPORT_OR_PREVIEW_VIDEO: 'ExportOrPreviewVideo',
    },
    
    MediatorNames: {
      APP_MEDIATOR: 'AppMediator',
      MAIN_VIEW_MEDIATOR: 'MainViewMediator',
      RECORDED_VIDEO_LIST_MEDIATOR: 'RecordedVideoListMediator',
    },
  
    ProxyNames: {
      INDEXEDDB_PROXY: 'IndexedDBProxy',
    },
  
    IndexedDBName: 'ScreenRecorderOnline',
  
    MediaRecorder: {
      __codec: undefined,
      get MIME_TYPE() {
        if (!this.__codec) {
          if (MediaRecorder.isTypeSupported('video/webm; codec=h264')) {
            this.__codec = 'video/webm; codec=h264';
          } else if (
            MediaRecorder.isTypeSupported('video/webm; codecs="opus,vp8"')
          ) {
            this.__codec = 'video/webm; codecs="opus,vp8"';
          } else {
            this.__codec = 'video/webm';
          }
        }
        console.debug('Codec is ' + this.__codec);
        return this.__codec;
      },
      TIME_SPLIT: 3000,
    },
  };
  
  export default Constants;