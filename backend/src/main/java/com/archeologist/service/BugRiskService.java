package com.archeologist.service;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class BugRiskService {

     // ADD THIS METHOD HERE
    private boolean isCodeFile(String file) {
        return file.endsWith(".java") ||
               file.endsWith(".js") ||
               file.endsWith(".ts") ||
               file.endsWith(".py") ||
               file.endsWith(".cpp") ||
               file.endsWith(".c") ||
               file.endsWith(".go") ||
               file.endsWith(".rb");
    }

    public List<Map<String, Object>> calculateBugRisk(List<Map<String, Object>> commits) {

        Map<String, Integer> fileChanges = new HashMap<>();
        Map<String, Integer> bugFixCounts = new HashMap<>();

        for (Map<String, Object> commit : commits) {

            String message = commit.get("message").toString().toLowerCase();
            List<String> files = (List<String>) commit.get("files");

            if (files == null || files.isEmpty()) {
                continue;
            }

            boolean isBugFix = message.contains("fix") ||
                               message.contains("bug") ||
                               message.contains("patch") ||
                               message.contains("hotfix");

            

                               for (String file : files) {

                                  // SKIP non-code files
                                  if (!isCodeFile(file)) {
                                      continue;
                                  }
                              
                                  fileChanges.put(file,
                                          fileChanges.getOrDefault(file, 0) + 1);
                              
                                  if (isBugFix) {
                                      bugFixCounts.put(file,
                                              bugFixCounts.getOrDefault(file, 0) + 1);
                                  }
                              }
        }

        List<Map<String, Object>> result = new ArrayList<>();

        for (String file : fileChanges.keySet()) {

            int changes = fileChanges.getOrDefault(file, 0);
            int bugs = bugFixCounts.getOrDefault(file, 0);

            double riskScore = (bugs * 0.7) + (changes * 0.3);

            Map<String, Object> map = new HashMap<>();
            map.put("file", file);
            map.put("riskScore", riskScore);

            result.add(map);
        }

        result.sort((a, b) ->
                Double.compare((double) b.get("riskScore"),
                               (double) a.get("riskScore")));

        return result;
    }
}