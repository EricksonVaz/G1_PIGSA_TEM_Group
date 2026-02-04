import https from "https";

export interface IEfacturaPayloadItem {
  TaxId?: number;
  Name?: string;
  NormalizedName?: string;
  TypeCode?: string;
  TypeDescription?: string;
  TaxAreaCode?: number;
  BI?: number;
  HasCeasedActivities?: boolean;
}

export interface IEfacturaConsultaNIFResponse {
  payload?: IEfacturaPayloadItem[];
  succeeded?: boolean;
}

function buildTimestamp() {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    now.getFullYear().toString() +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds())
  );
}

function requestJSON(url: string, method: "GET", headers: Record<string, string>) {
  return new Promise<any>((resolve, reject) => {
    const parsedUrl = new URL(url);

    const req = https.request(
      {
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname + parsedUrl.search,
        method,
        headers,
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
    req.end();
  });
}

export class EfacturaConsultaNIF {
  static async consultar(nif: string) {
    const token = process.env.EFACTURA_BEARER_TOKEN;
    if (!token) {
      return {
        succeeded: false,
        payload: [],
        error: "EFACTURA_BEARER_TOKEN em falta",
      };
    }

    const timestamp = buildTimestamp();
    const url = `https://services.efatura.cv/v1/taxpayer/search?Name=&CurrentDateTimeStamp=${timestamp}&TaxId=${encodeURIComponent(
      nif
    )}`;

    const response = (await requestJSON(url, "GET", {
      Authorization: `Bearer ${token}`,
    })) as IEfacturaConsultaNIFResponse;

    return response;
  }
}
