import { getWeb3Provider, IExecDataProtector } from "@iexec/dataprotector";
import { IExecWeb3mail } from "@iexec/web3mail";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  taskId: string;
};

export default async function POST(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (!process.env.NEXT_PRIVATE_IEXEC_KEY) return;
  const { email, subject, content } = req.body

  const web3Provider = getWeb3Provider(process.env.NEXT_PRIVATE_IEXEC_KEY);

  const dataProtector = new IExecDataProtector(web3Provider);
  const web3mail = new IExecWeb3mail(web3Provider);

  const protectedData = await dataProtector.protectData({
    name: 'email',
    data: {
      email: email as string,
    },
  });

  console.log("Email protected:", protectedData);

  const grantedAccess = await dataProtector.grantAccess({
    protectedData: protectedData.address,
    authorizedApp: "web3mail.apps.iexec.eth",
    authorizedUser: "0x0000000000000000000000000000000000000000",
  });

  console.log("Access granted:", grantedAccess);

  const { taskId } = await web3mail.sendEmail({
    protectedData: protectedData.address,
    emailSubject: subject as string,
    emailContent: content as string,
    contentType: "text/html",
  });

  console.log("Task id: ", taskId);

  res.status(200).json({ taskId });
}
