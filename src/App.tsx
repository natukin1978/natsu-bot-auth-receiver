import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next";
import "./App.css"

const REDIRECT_URI = "https://natukin1978.github.io/natsu-bot-auth-receiver/";
const SOURCE_URI = "https://github.com/natukin1978/natsu-bot-auth-receiver";

const CLIENT_ID = {
  TWITCH: "g1gb6b5as9zb48wlde0v0ux3frg2i3",
};

const AUTH_INFOS = [
  {
    title: "information.twitch_chat_bot",
    application_link: "https://github.com/natukin1978/twitch-chat-bot",
    scopes: [
      "chat:read",
      "chat:edit",
      "moderator:manage:banned_users",
    ],
  },
  {
    title: "information.twitch_chat_trans_bot",
    application_link: "https://github.com/natukin1978/twitch-chat-trans-bot",
    scopes: [
      "chat:read",
      "chat:edit",
    ],
  },
  {
    title: "information.twitch_chat_to_3tene",
    application_link: "https://github.com/natukin1978/twitch-chat-to-3tene",
    scopes: [
      "chat:read",
    ],
  },
];

const getUrlTwitchAuth = (scopes: string[]): string => {
  const scope = scopes.join(" ");
  const params = {
    client_id: CLIENT_ID.TWITCH,
    redirect_uri: REDIRECT_URI,
    response_type: "token",
    scope: scope,
  }
  const end_point = "https://id.twitch.tv/oauth2/authorize";
  const params_str = new URLSearchParams(params).toString();
  return end_point + "?" + params_str;
};

function App() {
  const { t } = useTranslation();

  const [accessToken, setAccessToken] = useState<string>("");

  const [disableToken, setDisableToken] = useState<string>("");
  const [disableTokenMessage, setDisableTokenMessage] = useState<string>("");

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const accessTokenMatch = hash.match(/access_token=([^&]*)/);
      if (accessTokenMatch && accessTokenMatch[1]) {
        setAccessToken(accessTokenMatch[1]);
      }
    }
  }, []);

  const revokeTwitchToken = async (): Promise<void> => {
    const end_point = "https://id.twitch.tv/oauth2/revoke";

    // 送信するデータをURLエンコード形式で準備します。
    const params = new URLSearchParams();
    params.append("client_id", CLIENT_ID.TWITCH);
    params.append("token", disableToken);

    const response = await fetch(end_point, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    // レスポンスが成功したか（ステータスコードが200番台か）をチェックします。
    // Twitchのドキュメントによると、成功時は 200 OK が返されます。
    if (!response.ok) {
      // エラーレスポンスの内容を読み取って、より詳細なエラーメッセージを作成します。
      const errorData = await response.json();
      throw new Error(
        // トークンの無効化に失敗しました。
        `${t("messages.token_deactivation_failed")} ${t("messages.status")}: ${response.status} - ${errorData.message || t("messages.unknown_error")}`
      );
    }
  };

  const doDisableToken = async () => {
    if (!disableToken) return;
    try {
      await revokeTwitchToken();
      // 正常に無効化しました。
      setDisableTokenMessage(t("messages.successfully"));
    } catch (error: unknown) {
      if (error instanceof Error) {
        setDisableTokenMessage(error.message);
      } else {
        // 処理に失敗しました。
        setDisableTokenMessage(t("messages.failed"));
      }
    }
  };

  const steps_text_values = t("steps.text_values", { returnObjects: true }) as string[];

  return (
    <div>
      <h2 style={{ borderBottom: "1px solid #000" }}>
        {t("title")}
      </h2>
      <div>
        <h3>
          {t("steps.title")}
        </h3>
        <ol>
          {steps_text_values.map(value => (
            <li key={value}>{value}</li>
          ))}
        </ol>
      </div>
      {accessToken && (
        <div>
          <h3>
            {t("result.title")}
          </h3>
          <label>
            access_token
          </label>
          &nbsp;:&nbsp;
          <input value={accessToken} size={30} readOnly />
        </div>
      )}
      <div>
        <h3>
          {t("information.title")}
        </h3>
        <table>
          <thead>
            <tr>
              <th>{t("information.purpose")}</th>
              <th>{t("information.authorize")}</th>
              <th>{t("information.scopes")}</th>
            </tr>
          </thead>
          <tbody>
            {
              AUTH_INFOS.map(auth_info => (
                <tr key={auth_info.application_link}>
                  <td>
                    <a href={auth_info.application_link} target="_blank" rel="noopener noreferrer">
                      {t(auth_info.title)}
                    </a>
                  </td>
                  <td>
                    <a href={getUrlTwitchAuth(auth_info.scopes)} className="a_to_button">
                      {t("information.authenticate_with_twitch")}
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
          {t("revoke_access.title")}
        </h3>
        {t("revoke_access.explanation")}
        <div>
          <label>
            access_token
          </label>
          &nbsp;:&nbsp;
          <input value={disableToken} onChange={e => setDisableToken(e.target.value)} size={30} />
          <button onClick={doDisableToken} className="button" style={{ marginLeft: "1em" }}>
            {t("revoke_access.submit")}
          </button>
        </div>
        <div>
          {disableTokenMessage}
        </div>
      </div>
      <div>
        <h3>
          {t("misc.title")}
        </h3>
        {t("misc.source_page")}
        <a href={SOURCE_URI} target="_blank" rel="noopener noreferrer">
          Github
        </a>
      </div>
    </div>
  )
}

export default App
