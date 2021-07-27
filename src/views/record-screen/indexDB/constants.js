const Constants = {
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