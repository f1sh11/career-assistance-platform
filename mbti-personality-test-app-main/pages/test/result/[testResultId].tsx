import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Option, AsyncData, Result } from "@swan-io/boxed";
import { Flex, Show, Text, useToast, UseToastOptions } from "@chakra-ui/react";
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

  useEffect(() => {
    if (router.isReady) {
      setTestResult(AsyncData.Loading());
      const id = parseInt(router.query.testResultId as string);
      getSavedTestResult(id).tap((result) =>
        setTestResult(AsyncData.Done(result))
      );
    }
  }, [router.isReady, router.query.testResultId]);

  // 保存 MBTI 类型到后端
  useEffect(() => {
    const saveMbtiType = async (mbtiType: string) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("未找到用户认证 token");
          return;
        }

        await axios.post(
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
      } catch (error: any) {
        console.error("❌ 保存失败:", error.response?.data || error.message);
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

    if (testResult.isDone()) {
      const result = testResult.value;
      if (result.isOk()) {
        const value = result.value;
        if (value.isSome()) {
          const data = value.value;

          const personalityClassGroup = getPersonalityClassGroupByTestScores(
            data.testScores
          );
          const mbtiType = personalityClassGroup.type;

          console.log("✅ Calculated MBTI Type:", mbtiType);

          if (mbtiType?.length === 4) {
            saveMbtiType(mbtiType);
          }
        }
      }
    }
  }, [testResult, toast]);

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
                  <Flex
                    h="full"
                    direction={{ base: "column", lg: "row" }}
                  >
                    <TestResultStats testResult={data} />
                    <TestResult testResult={data} />
                    <Show above="lg">
                      <TestResultTableOfContent />
                    </Show>
                  </Flex>
                ),
                None: () => <Text>No Data</Text>,
              }),
          }),
      })}
    </MainLayout>
  );
}