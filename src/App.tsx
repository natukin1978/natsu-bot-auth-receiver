import { useState, useEffect } from 'react'
import './App.css'

const text_twitch_auth = "Twitchで認証";

const get_url_twitch_auth = (scopes: string[]): string => {
  const scope = scopes.join(" ");
  const params = {
    client_id: "g1gb6b5as9zb48wlde0v0ux3frg2i3",
    redirect_uri: "https://natukin1978.github.io/natsu-bot-auth-receiver/",
    response_type: "token",
    scope: scope,
  }
  const end_point = "https://id.twitch.tv/oauth2/authorize";
  const params_str = new URLSearchParams(params).toString();
  return end_point + "?" + params_str;
}

const auth_infos = [
  {
    title: "Twitch配信チャットBOT",
    application_link: "https://github.com/natukin1978/twitch-chat-bot",
    scopes: [
      "chat:read",
      "chat:edit",
      "moderator:manage:banned_users",
    ],
  },
  {
    title: "Twitchの外国語を翻訳するBOT",
    application_link: "https://github.com/natukin1978/twitch-chat-trans-bot",
    scopes: [
      "chat:read",
      "chat:edit",
    ],
  },
  {
    title: "Twitchから\"3tene\"にショートカット送信",
    application_link: "https://github.com/natukin1978/twitch-chat-to-3tene",
    scopes: [
      "chat:read",
    ],
  },
];

function App() {
  const [accessToken, setAccessToken] = useState<string>("");

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
    <div>
      <h2 style={{ borderBottom: "1px solid #000" }}>
        ナツキソBOT OAuth認証
      </h2>
      <div>
        <h3>
          作業手順
        </h3>
        <ol>
          <li>下の[{text_twitch_auth}]ボタンを押してください</li>
          <li>Twitchのログインページが表示されたら、BOTにしたいユーザーでログインしてください</li>
          <li>ログインページが表示されず、違うユーザーが表示されたら、一度Twitchのページでログアウトしてください</li>
          <li>表示ユーザーで問題なければ、認証(Authorize)を押してください</li>
          <li>正常に処理が進むと、このページに戻って来るので access_token の値をコピーします</li>
          <li>対象アプリの config.json を開いて、twitch.accessToken に設定してください</li>
        </ol>
      </div>
      {accessToken && (
        <div>
          <h3>
            結果
          </h3>
          <label>
            access_token
          </label>
          &nbsp;:&nbsp;
          <input type="text" value={accessToken} size={30} readOnly />
        </div>
      )}
      <div>
        <h3>
          一覧
        </h3>
        <table>
          <thead>
            <tr>
              <th>用途</th>
              <th>認証</th>
              <th>使用スコープ</th>
            </tr>
          </thead>
          <tbody>
            {
              auth_infos.map(auth_info => (
                <tr key={auth_info.title}>
                  <td>
                    <a href={auth_info.application_link} target="_blank" rel="noopener noreferrer">
                      {auth_info.title}
                    </a>
                  </td>
                  <td>
                    <a href={get_url_twitch_auth(auth_info.scopes)} className="a_to_button">
                      {text_twitch_auth}
                    </a>
                  </td>
                  <td>
                    <ul>
                      {
                        auth_info.scopes.map(scope => (
                          <li key={auth_info.title + scope}>{scope}</li>
                        ))
                      }
                    </ul>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
      <div>
        <h3>
          その他
        </h3>
        このページのソースコードはこちらで公開してます。
        <a href="https://github.com/natukin1978/natsu-bot-auth-receiver" target="_blank" rel="noopener noreferrer">
          Github
        </a>
      </div>
    </div>
  )
}

export default App
