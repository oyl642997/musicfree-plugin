/**
 * MusicFree v1.0.0 beta.4 示例音源插件
 * 遵循 CommonJS 规范
 */
module.exports = {
  // 插件基本信息
  platform: "示例音乐源",
  version: "1.0.0",
  author: "Developer",
  desc: "基于公开API接口适配的 MusicFree 插件",

  // 1. 搜索接口 (支持单曲搜索)
  async search(query, page, type) {
    // 适配不同的搜索类型，MusicFree 常规主要处理 0: 单曲
    if (type !== 0) {
      return { isEnd: true, data: [] };
    }

    try {
      const url = `https://api.example.com/search?keyword=${encodeURIComponent(query)}&page=${page}`;
      const response = await fetch(url);
      const res = await response.json();

      // 假设公开 API 返回的数据结构为 { code: 200, data: { list: [...] } }
      const songs = (res.data && res.data.list) || [];

      const formattedSongs = songs.map(item => ({
        id: item.songId,          // 歌曲唯一 ID
        name: item.title,         // 歌曲名称
        artist: item.artistName,  // 歌手名称
        album: item.albumName,    // 专辑名称
        artwork: item.picUrl,     // 专辑封面图
        duration: item.duration,  // 歌曲时长（秒）
        raw: item                 // 保留原始数据，方便后续获取播放链接
      }));

      return {
        isEnd: songs.length === 0, // 是否加载完毕
        data: formattedSongs
      };
    } catch (error) {
      console.error("Search failed:", error);
      return { isEnd: true, data: [] };
    }
  },

  // 2. 获取音乐真实播放链接
  async getPlayUrl(song) {
    try {
      // 优先从 raw 中取 id 或直接用 song.id 请求真实播放地址
      const songId = song.id;
      const url = `https://api.example.com/play_url?id=${songId}`;
      const response = await fetch(url);
      const res = await response.json();

      // 返回可直接播放的音频直链
      return res.data.url || "";
    } catch (error) {
      console.error("Get play url failed:", error);
      return "";
    }
  },

  // 3. 获取歌词
  async getLyric(song) {
    try {
      const songId = song.id;
      const url = `https://api.example.com/lyric?id=${songId}`;
      const response = await fetch(url);
      const res = await response.json();

      return {
        lyric: res.data.lyric || "",          // LRC 格式歌词文本
        translation: res.data.tlyric || ""    // 翻译歌词（可选）
      };
    } catch (error) {
      console.error("Get lyric failed:", error);
      return { lyric: "", translation: "" };
    }
  }
};