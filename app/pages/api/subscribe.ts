import { getWeb3Provider, IExecDataProtector } from "@iexec/dataprotector";
import { IExecWeb3mail } from "@iexec/web3mail";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  taskId: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (!process.env.NEXT_PRIVATE_IEXEC_KEY) return;

  const web3Provider = getWeb3Provider(process.env.NEXT_PRIVATE_IEXEC_KEY);

  const dataProtector = new IExecDataProtector(web3Provider);
  const web3mail = new IExecWeb3mail(web3Provider);

  const emailProtected = await dataProtector.fetchProtectedData({
    owner: "",
  });

  const grantedAccess = await dataProtector.grantAccess({
    protectedData: "",
    authorizedApp: "web3mail.apps.iexec.eth",
    authorizedUser: "0x0000000000000000000000000000000000000000",
  });

  console.log("access granted: ", grantedAccess);
  console.log(emailProtected);

  const { taskId } = await web3mail.sendEmail({
    protectedData: "",
    emailSubject: "TEST",
    emailContent: "TEST",
    contentType: "text/html",
  });

  console.log("Task id: ", taskId);

  res.status(200).json({ taskId });
}
