import { useState, useEffect } from 'react'

function App() {
  const [accessToken, setAccessToken] = useState<string>("");

  const scope = [
    "chat:read",
    "chat:edit",
    "moderator:manage:banned_users",
  ].join(" ");
  const params = {
    client_id: "g1gb6b5as9zb48wlde0v0ux3frg2i3",
    redirect_uri: "https://natukin1978.github.io/natsu-bot-auth-receiver/",
    response_type: "token",
    scope: scope,
  }
  const params_str = new URLSearchParams(params).toString();
  const url_twitch_auth = "https://id.twitch.tv/oauth2/authorize?" + params_str;

  const text_twitch_auth = "Twitch認証";

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const accessTokenMatch = hash.match(/access_token=([^&]*)/);
      if (accessTokenMatch && accessTokenMatch[1]) {
        setAccessToken(accessTokenMatch[1]);
      }
    }
  }, []);

  return (
    <>
      <h2 style={{ borderBottom: "1px solid #000" }}>
        ナツキソBOT OAuth認証
      </h2>
      <h3>
        作業手順
      </h3>
      <ol>
        <li>下の[{text_twitch_auth}]を押してください</li>
        <li>Twitchのログインページが表示されたら、BOTとして振る舞いたいユーザーでログインしてください</li>
        <li>ログインページが表示されず、違うユーザーが表示されたら、一度Twitchのページに行きログアウトしてください</li>
        <li>表示ユーザーで問題なければ、認証(Authorize)を押してください</li>
        <li>正常に処理が進むと、このページに戻って来るので access_token の値をコピーします</li>
        <li>アプリの config.json を開いて、twitch.accessToken に設定して保存してください</li>
      </ol>
      Twitch配信チャットBOT(twitch-chat-bot)向け <a href={url_twitch_auth}>{text_twitch_auth}</a>
      {accessToken && (
        <div>
          <label>
            access_token
          </label>
          &nbsp;:&nbsp;
          <input type="text" value={accessToken} size={30} readOnly />
        </div>
      )}
    </>
  )
}

export default App
