import type { NextApiRequest, NextApiResponse } from "next";
import Bloom from "@ethereumjs/vm/dist/bloom";
import Web3 from "web3";

import Base_metadata from "../../../../../../../public/contracts/Base_metadata.json";
import { Asset } from "../../../../../../../interfaces";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { registry_id, address, id },
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        const contractAddress = (id as string).split(":")[0];
        const tokenId: number = parseInt((id as string).split(":")[1]);
        const ownerAddress = (address as string).toLowerCase();

        const web3: Web3 = new Web3(
          new Web3.providers.HttpProvider(
            process.env.NEXT_PUBLIC_RINKEBY_ENDPOINT
          )
        );

        const contract = new web3.eth.Contract(
          Base_metadata["output"]["abi"] as any,
          contractAddress
        );

        const owner = await contract.methods.ownerOf(tokenId).call();
        if (owner.toLowerCase() !== ownerAddress) {
          throw new Error("Token ID not owned by address");
        }

        const asset: Asset = {
          id: id as string,
          amount: 1,
          urn: {
            decentraland: `urn:decentraland:matic:collections-thirdparty:${registry_id}:${contractAddress}:${tokenId}`,
          },
        };

        res.status(200).json(asset);
      } catch (error) {
        res.status(400).json({
          id: id as string,
          amount: 0,
          urn: {
            decentraland: "",
          },
        });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
