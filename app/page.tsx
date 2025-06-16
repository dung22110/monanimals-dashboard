"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Card, CardContent } from "@/components/ui/card";

const MONAD_RPC = "https://testnet-rpc.monad.xyz";
const provider = new ethers.JsonRpcProvider(MONAD_RPC);

const monanimals = [
  { name: "GiraffETH", emoji: "🦜" },
  { name: "SlothCoin", emoji: "🦚" },
  { name: "OctaSwap", emoji: "🐙" },
  { name: "TurtleDex", emoji: "🐢" },
  { name: "BeeBridge", emoji: "🐝" },
];

export default function DashboardZoo() {
  const [txCounts, setTxCounts] = useState<number[]>([]);
  const [txAddresses, setTxAddresses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const latest = await provider.getBlockNumber();
        const blockPromises = [];

        for (let i = latest - 20; i <= latest; i++) {
          blockPromises.push(provider.getBlock(i, true));
        }

        const blocks = await Promise.all(blockPromises);

        const contractTxMap: Record<string, number> = {};

        blocks.filter(Boolean).forEach((block) => {
          block!.transactions.forEach((tx: any) => {
            if (tx.to) {
              contractTxMap[tx.to] = (contractTxMap[tx.to] || 0) + 1;
            }
          });
        });

        const sorted = Object.entries(contractTxMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, monanimals.length);

        setTxCounts(sorted.map(([_, count]) => count));
        setTxAddresses(sorted.map(([address]) => address));
      } catch (err) {
        console.error("Lỗi khi fetch dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {monanimals.map((mon, idx) => (
        <Card key={mon.name}>
          <CardContent className="flex flex-col items-center">
            <div className="text-6xl animate-bounce-slow">{mon.emoji}</div>
            <h2 className="text-xl font-bold mt-4">{mon.name}</h2>
            <p className="mt-2 text-gray-700 text-sm">
              {loading ? (
                <span className="animate-spin inline-block w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full"></span>
              ) : (
                `${txCounts[idx] ?? 0} giao dịch`
              )}
            </p>
            {!loading && txAddresses[idx] && (
              <p className="mt-2 text-xs text-gray-500 text-center break-all">
                {txAddresses[idx]}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}



