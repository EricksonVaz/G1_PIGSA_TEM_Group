import https from "https";

export interface IConsultaLocalVotoPerson {
  nome?: string;
  data_nascimento?: string;
  nome_mae?: string;
  nome_pai?: string | null;
  identificacao?: string;
  local_voto?: string;
  mesa_voto?: string;
  concelho?: string;
  latitude?: number;
  longitude?: number;
  data_recenseamento?: string;
  pos_nome?: string;
  uuid?: string;
}

export interface IConsultaLocalVotoResponse {
  error?: boolean;
  success?: boolean;
  data?: {
    result?: {
      person?: IConsultaLocalVotoPerson;
    };
  };
}

function requestJSON(url: string, method: "POST", headers: Record<string, string>, body: any) {
  return new Promise<any>((resolve, reject) => {
    const parsedUrl = new URL(url);
    const payload = JSON.stringify(body ?? {});

    const req = https.request(
      {
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname + parsedUrl.search,
        method,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload).toString(),
          ...headers,
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (err) {
            reject(err);
          }
        });
      }
    );

    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

export class ConsultaLocalVoto {
  static async consultar(nome: string, dataNascimento: string) {
    const apiKey =
      process.env.CNE_API_KEY ??
      "28aa9bcd4c1555b93e76a50b54e97461ccf41f41ae6fb3534f02d2a122dec16a";

    const response = (await requestJSON(
      "https://eleicoes.cv/api/local-de-voto",
      "POST",
      {
        "x-api-key": apiKey,
      },
      { nome, data_nascimento: dataNascimento }
    )) as IConsultaLocalVotoResponse;

    return response;
  }
}
