import type { NextApiRequest, NextApiResponse } from "next";
import { Bloom } from "@ethereumjs/vm";
import Web3 from "web3";

import Base_metadata from "../../../../public/contracts/Base_metadata.json";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { registry_id },
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        const contractAddress: string =
          "0xc2304003fbff7bf35215973c68ea74ba978dabe4";
        const web3: Web3 = new Web3(
          new Web3.providers.HttpProvider(
            process.env.NEXT_PUBLIC_RINKEBY_ENDPOINT
          )
        );

        const contract = new web3.eth.Contract(
          Base_metadata["output"]["abi"] as any,
          contractAddress
        );

        const totalSupply: number = await contract.methods.totalSupply().call();

        const owners: string[] = [];
        for (let tokenId = 0; tokenId < totalSupply; tokenId++) {
          const owner = await contract.methods.ownerOf(tokenId).call();
          owners.push(owner);
        }

        const filter = new Bloom();

        for (const owner of owners) {
          const buffer = Buffer.from(owner);

          if (!filter.check(buffer)) {
            filter.add(buffer);
          }
        }

        const data: string = filter.bitvector.toString("hex");

        res.status(200).json({ data });
      } catch (error) {
        res.status(400).json({ data: "" });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
