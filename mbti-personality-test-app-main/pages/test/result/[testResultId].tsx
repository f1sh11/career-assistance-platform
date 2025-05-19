// pages/test/result/[testResultId].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Option, AsyncData, Result } from "@swan-io/boxed";
import { Flex, Show, Text, useToast, UseToastOptions, Button } from "@chakra-ui/react";
import axios from "axios";

import MainLayout from "../../../components/layouts/main-layout";
import TestResult from "../../../components/test/test-result";
import TestResultTableOfContent from "../../../components/test/test-result-table-of-content";
import TestResultStats from "../../../components/test/test-result-stats";
import {
  TestResult as ITestResult,
  getSavedTestResult,
  getPersonalityClassGroupByTestScores
} from "../../../lib/personality-test";

export default function TestResultPage() {
  const router = useRouter();
  const toast = useToast();

  const [testResult, setTestResult] = useState<
    AsyncData<Result<Option<ITestResult>, Error>>
  >(AsyncData.NotAsked());
  const [tokenReady, setTokenReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      setTimeout(() => setTokenReady(true), 300);

      const currentUrl = new URL(window.location.href);
      if (!currentUrl.searchParams.get("token")) {
        currentUrl.searchParams.set("token", token);
        window.history.replaceState({}, "", currentUrl.toString());
      }
    } else {
      const localToken = localStorage.getItem("token");
      if (!localToken) {
        console.warn("⚠️ token 未注入且 localStorage 中也为空！");
      } else {
        const currentUrl = window.location.href;
        const connector = currentUrl.includes("?") ? "&" : "?";
        const newUrl = `${currentUrl}${connector}token=${localToken}`;
        window.location.href = newUrl;
      }
    }
  }, []);

  useEffect(() => {
    if (router.isReady) {
      setTestResult(AsyncData.Loading());
      const id = parseInt(router.query.testResultId as string);
      getSavedTestResult(id).tap((result) =>
        setTestResult(AsyncData.Done(result))
      );
    }
  }, [router.isReady, router.query.testResultId]);

  const saveMbtiType = async (mbtiType: string) => {
    let token = localStorage.getItem("token");

    if (!token) {
      const params = new URLSearchParams(window.location.search);
      token = params.get("token") || "";
      if (token) {
        localStorage.setItem("token", token);
      }
    }

    token = localStorage.getItem("token");

    if (!token) {
      toast({
        title: "缺少 Token",
        description: "未检测到登录信息，无法保存结果",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      } as UseToastOptions);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/me/mbti",
        { mbtiType },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast({
        title: "MBTI保存成功",
        description: "你的MBTI测试结果已成功保存✅",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      } as UseToastOptions);

      setTimeout(() => {
        window.location.href = "http://localhost:3000/profile";
      }, 5000);
    } catch (error: any) {
      toast({
        title: "保存失败",
        description: "无法保存MBTI结果，请稍后再试❗",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      } as UseToastOptions);
    }
  };

  useEffect(() => {
    if (tokenReady && testResult.isDone()) {
      const result = testResult.value;
      if (result.isOk()) {
        const value = result.value;
        if (value.isSome()) {
          const data = value.value;
          const personalityClassGroup = getPersonalityClassGroupByTestScores(
            data.testScores
          );
          const mbtiType = personalityClassGroup.type;

          if (mbtiType?.length === 4) {
            saveMbtiType(mbtiType);
          }
        }
      }
    }
  }, [testResult, toast, tokenReady]);

  return (
    <MainLayout>
      {testResult.match({
        NotAsked: () => <Text>Loading</Text>,
        Loading: () => <Text>Loading</Text>,
        Done: (result) =>
          result.match({
            Error: () => <Text>Something went wrong! Please refresh!</Text>,
            Ok: (value) =>
              value.match({
                Some: (data) => (
                  <Flex h="full" direction={{ base: "column", lg: "row" }}>
                    <TestResultStats testResult={data} />
                    <TestResult testResult={data} />
                    <Show above="lg">
                      <TestResultTableOfContent />
                    </Show>
                    <Button mt={8} colorScheme="blue" onClick={() => router.push("/profile")}>
                      返回主页
                    </Button>
                  </Flex>
                ),
                None: () => <Text>No Data</Text>,
              }),
          }),
      })}
    </MainLayout>
  );
}
