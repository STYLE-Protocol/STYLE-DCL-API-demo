import type { NextApiRequest, NextApiResponse } from "next";
import Bloom from "@ethereumjs/vm/dist/bloom";
import Web3 from "web3";

import Base_metadata from "../../../../../../public/contracts/Base_metadata.json";
import { Asset } from "../../../../../../interfaces";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { registry_id, address, startAt },
    method,
  } = req;

  const ownerAddress = (address as string).toLowerCase();

  switch (method) {
    case "GET":
      try {
        const startAtNum = startAt ? parseInt(startAt as string) : 0;
        const limit: number = 100;
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

        const tokenIdMax = Math.min(startAtNum + limit, totalSupply);

        const assets: Asset[] = [];
        for (let tokenId = 0; tokenId < tokenIdMax; tokenId++) {
          const owner = await contract.methods.ownerOf(tokenId).call();
          if (owner.toLowerCase() === ownerAddress) {
            assets.push({
              id: `${contractAddress}:${tokenId}`,
              amount: 1,
              urn: {
                decentraland: `urn:decentraland:matic:collections-thirdparty:${registry_id}:${contractAddress}:${tokenId}`,
              },
            });
          }
        }

        res.status(200).json({
          address: ownerAddress,
          assets,
          total: assets.length,
          page: 1,
          next:
            tokenIdMax < totalSupply
              ? `/registry/${registry_id}/address/${address}/assets?startAt=${tokenIdMax}`
              : "",
        });
      } catch (error) {
        res.status(400).json({
          address: ownerAddress,
          assets: [],
          total: 0,
          page: 1,
          next: ``,
        });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
