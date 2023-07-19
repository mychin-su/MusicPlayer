const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER';

const player = $('.player');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progressBar = $('.progress-bar');
const progressValue = $('.progress-bar__value')
const progressCurrentTime = $(".progress-time__current-time");
const progressDuration = $(".progress-time__duration");
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist')
const heart = $('.btn-heart');
const container = $('.container')
const toggle = $('.toggle');
const sun = $('.fa-sun');
const moon = $('.fa-moon');
const title = $('title');
const volumeBtn = $('.btn-volume');
const volumeBar = $('.volume-bar');
const volumeBarValue = $('.volume-bar__value');

const app = {
  currentIndex: 0,
  currentVolume: 1,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  isHeart: false,
  isMute: false,
  isHoldVolumeBar: false,

  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },

  songs: [
    {
      name: 'Yêu 5',
      singer: 'Rhymastic',
      path: './assets/music/song6.mp3',
      image: './assets/img/song6.jpg'
    },
    {
      name: 'Em Đồng ý',
      singer: 'Đức Phúc',
      path: './assets/music/song2.mp3',
      image: './assets/img/song2.jpg'
    },
    {
      name: 'Thê Lương',
      singer: 'Phúc Chinh',
      path: './assets/music/song3.mp3',
      image: './assets/img/song3.jpg'
    },
    {
      name: 'Thuyền Quyên',
      singer: 'Diệu Quyên, Cao Tri',
      path: './assets/music/song4.mp3',
      image: './assets/img/song4.jpg'
    },
    {
      name: 'Waiting For You',
      singer: 'Mono',
      path: './assets/music/song5.mp3',
      image: './assets/img/song5.jpg'
    },

    {
      name: 'Bật Tình Yêu Lên',
      singer: 'Tăng Duy Tân, Hòa Minzy',
      path: './assets/music/song1.mp3',
      image: './assets/img/song1.jpg'
    },

    {
      name: 'Sao Cũng Được',
      singer: 'Thành Đạt',
      path: './assets/music/song7.mp3',
      image: './assets/img/song7.jpg'
    },
    {
      name: 'Kiếp Má Hồng',
      singer: 'Tlong, Lạc Khởi',
      path: './assets/music/song8.mp3',
      image: './assets/img/song8.jpg'
    },
    {
      name: 'Em Là Kẻ Đáng Thương',
      singer: 'Phát Huy',
      path: './assets/music/song9.mp3',
      image: './assets/img/song9.jpg'
    },
    {
      name: 'Chưa Quên Người Yêu Cũ',
      singer: 'Ha Nhi',
      path: './assets/music/song10.mp3',
      image: './assets/img/song10.jpg'
    },
    {
      name: 'Hoa Cỏ Lau',
      singer: 'Phong Max',
      path: './assets/music/song11.mp3',
      image: './assets/img/song11.jpg'
    },
    {
      name: 'Gió',
      singer: 'Jank',
      path: './assets/music/song12.mp3',
      image: './assets/img/song12.jpg'
    },
    {
      name: 'Như Anh Đã Thấy Em',
      singer: 'PhúcXP',
      path: './assets/music/song13.mp3',
      image: './assets/img/song13.jpg'
    }
  ],

  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
      <div class="song ${index === app.currentIndex ? 'active' : ""}" data-index="${index}">

        <div class="thumb"
          style="background-image: url('${song.image}')">
        </div>

        <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}</p>
        </div>

        <div class="music-waves ${index === app.currentIndex ? "active" : ""}">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>

        <div class="option">
          <i class="fas fa-ellipsis-h"></i>
        </div>
        
      </div>
      `
    })
    playlist.innerHTML = htmls.join('');
  },




  //  Định nghĩa thuộc tính
  defineProperties: function () {
    Object.defineProperty(this, 'currentSong', {
      get: function () {
        return this.songs[this.currentIndex];
      }
    });
  },

  handleEvents: function () {
    const _this = this;
    // Xử lý background
    moon.onclick = function () {
      container.style.backgroundImage = 'url("./assets/img/backgroundNight.png")';
      moon.style.color = '#000';
      sun.style.color = '#fff';
    }

    sun.onclick = function () {
      container.style.backgroundImage = 'url("./assets/img/backgroundMorning\ \(1\).png")';
      sun.style.color = 'yellow';
      moon.style.color = '#fff';
    }



    const cdWidth = cd.offsetWidth;
    //Xử lý CD quay / dừng
    const cdThumbAnimate = cdThumb.animate([
      { transform: 'rotate(360deg)' }
    ], {
      duration: 5000,
      iterations: Infinity,
    })


    cdThumbAnimate.pause();
    //Xử lý phóng to thu nhỏ CD
    document.onscroll = function () {
      const scrollTop = _this.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    }

    //Xử lý khi click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    }

    //Khi song được play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add('playing');
      cdThumbAnimate.play();
    }

    //Khi song được pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove('playing');
      cdThumbAnimate.pause();
    }

    // Khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progressValue.style.width = progressPercent + "%";
        //set durationTime và currentTime cho bài hát
        progressCurrentTime.textContent = _this.getMinutesSong();
      }
    }

    audio.onloadedmetadata = function () {
      progressDuration.textContent = _this.setMinutesSong(audio.duration);
    };

    progressBar.onmousedown = function (e) {
      const seekTime = (e.offsetX / this.offsetWidth) * audio.duration;
      audio.currentTime = seekTime;
    }



    // Khi next song 
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollActiveSong();
    }

    // Khi prev song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollActiveSong();
    }

    //Khi bật / tắt random song
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    }

    //Xủ lý lặp lại một song 
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isRepeat);
    }


    //Xử lý next song khi audio ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    }

    // Lắng nghe hành vi click vào playlist 
    playlist.onclick = function (e) {
      const songNode = e.target.closest('.song:not(.active)');
      const optionNode = e.target.closest('.option');
      if (songNode || optionNode) {
        //Xử lý khi click vào song
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }
      }
    }

    heart.onclick = function () {
      heart.classList.toggle("active");
    }



    window.onkeydown = function (e) {
      if (e.which == 32) {
        e.preventDefault();
        playBtn.click();
      }
      if (e.which == 37) {
        prevBtn.click();
      }
      if (e.which == 39) {
        nextBtn.click();
      }
    }

    volumeBar.onmousedown = function (e) {
      _this.currentVolume = (e.offsetX / this.offsetWidth).toFixed(2);
      audio.volume = _this.currentVolume;
      volumeBarValue.style.width = audio.volume * 100 + "%";
      if (audio.volume == 0) {
        _this.isMute = true;
      } else {
        _this.isMute = false;
      }

    };

    volumeBtn.onclick = function () {
      _this.isMute = !_this.isMute;
      volumeBtn.classList.toggle("active", _this.isMute);
      if (_this.isMute) {
        audio.volume = 0;
      } else {
        audio.volume = _this.currentVolume;
      }
    };


    audio.onvolumechange = function () {
      if (_this.isMute) {
        volumeBtn.classList.add("active");
        volumeBarValue.style.width = 0;
      } else {
        volumeBtn.classList.remove("active");
        volumeBarValue.style.width = audio.volume * 100 + "%";
      }
    };

  },

  scrollActiveSong: function () {
    setTimeout(() => {
      $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }, 200)
  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },

  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    title.innerText = this.songs[this.currentIndex].name;
    this.loadCurrentSong();
  },

  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    title.innerText = this.songs[this.currentIndex].name;
    this.loadCurrentSong();
  },

  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    title.innerText = this.songs[this.currentIndex].name;
    this.loadCurrentSong();
  },

  // Hàm lấy số phút cảu bài hát
  setMinutesSong() {
    const time = audio.duration;
    const minutes = Math.floor(time / 60).toString().padStart(2, "0");
    const seconds = Math.floor(time - 60 * minutes).toString().padStart(2, "0");
    return (finalTime = minutes + ":" + seconds);
  },

  getMinutesSong() {
    const time = audio.currentTime;
    const minutes = Math.floor(time / 60).toString().padStart(2, "0");
    const seconds = Math.floor(time - 60 * minutes).toString().padStart(2, "0");

    return (finalTime = minutes + ":" + seconds);
  },

  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },

  start: function () {
    // Gán cấu hình tử config vào ứng dụng 
    this.loadConfig();

    // Định nghĩa các thuộc tính cho object
    this.defineProperties();

    // Lắng nghe / xử lý sự kiện (DOM events)
    this.handleEvents();

    ;
    //Tải thông tin bài hát đầu tiên vào UI khi ứng dựng chạy
    this.loadCurrentSong();

    //Render playlist 
    this.render();

    // Hiển thị trạng thái ban đầu của button repeat và random
    randomBtn.classList.toggle('active', this.isRandom);
    repeatBtn.classList.toggle('active', this.isRepeat);
  }
}

app.start();



