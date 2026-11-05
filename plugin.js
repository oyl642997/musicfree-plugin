/**
 * MusicFree v1.0.0 beta.4 音源插件
 * 平台：网易云音乐（公开接口）
 */

module.exports = {
  platform: "网易云音乐",
  version: "1.0.0",
  author: "Developer",
  desc: "网易云音乐公开接口插件",

  // 1. 搜索单曲
  async search(query, page, type) {
    if (type !== 0) return { isEnd: true, data: [] };
    
    try {
      const limit = 20;
      const offset = (page - 1) * limit;
      const url = `https://music.163.com/api/search/get/web?csrf_token=&s=${encodeURIComponent(query)}&type=1&offset=${offset}&limit=${limit}`;
      
      const res = await fetch(url).then(r => r.json());
      const songs = (res.result && res.result.songs) || [];

      const formattedSongs = songs.map(item => ({
        id: String(item.id),
        name: item.name,
        artist: item.artists ? item.artists.map(a => a.name).join(", ") : "未知歌手",
        album: item.album ? item.album.name : "",
        artwork: item.album && item.album.picUrl ? item.album.picUrl : "",
        duration: item.duration ? Math.floor(item.duration / 1000) : 0,
      }));

      return {
        isEnd: songs.length < limit,
        data: formattedSongs
      };
    } catch (e) {
      return { isEnd: true, data: [] };
    }
  },

  // 2. 获取播放链接 (直连无损/标准音质)
  async getPlayUrl(song) {
    try {
      // 官方标准音频直链获取
      const url = `https://music.163.com/song/media/outer/url?id=${song.id}.mp3`;
      return url;
    } catch (e) {
      return "";
    }
  },

  // 3. 获取歌词
  async getLyric(song) {
    try {
      const url = `https://music.163.com/api/song/lyric?id=${song.id}&lv=1&kv=1&tv=-1`;
      const res = await fetch(url).then(r => r.json());
      
      return {
        lyric: (res.lrc && res.lrc.lyric) || "",
        translation: (res.tlyric && res.tlyric.lyric) || ""
      };
    } catch (e) {
      return { lyric: "", translation: "" };
    }
  }
};
