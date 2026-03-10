package com.archeologist.controller;

import com.archeologist.service.BugRiskService;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/bug-risk")
@CrossOrigin
public class BugRiskController {

    private final BugRiskService bugRiskService;

    public BugRiskController(BugRiskService bugRiskService) {
        this.bugRiskService = bugRiskService;
    }

    @PostMapping
    public List<Map<String, Object>> calculateRisk(
            @RequestBody List<Map<String, Object>> commits) {

        return bugRiskService.calculateBugRisk(commits);
    }
}