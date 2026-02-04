const SMS_API_URL = "https://mynodejs.host/csu-sms-server/send-sms";
const SMS_API_TOKEN ="E7mJ3iCU852tD2o1il3JkBxYEnQQ9pK3aVOqVUyAr6mZx6vpKuiuo";

export interface ISendSMSResponse {
  status: number;
  message?: string;
  smsInfo?: any;
  error?: any;
}

export async function sendSMS(phone: string, sms: string): Promise<ISendSMSResponse> {
  try {
    const response = await fetch(SMS_API_URL, {
      method: "POST",
      headers: {
        Authorization: "Bearer "+SMS_API_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone, sms }),
    });

    let data: any = undefined;
    try {
      data = await response.json();
    } catch (error) {
      data = { status: response.status, message: "Resposta invalida" };
    }

    return data as ISendSMSResponse;
  } catch (error) {
    return {
      status: 500,
      message: "Erro ao enviar SMS",
      error,
    };
  }
}
