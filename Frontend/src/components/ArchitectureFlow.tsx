"use client";

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Target,
  FileText,
  Search,
  BarChart3,
  HelpCircle,
  Blocks,
  Cpu,
} from "lucide-react";

export default function ArchitectureFlow() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const nodes = [
    {
      id: "workspace",
      name: "Strategic Workspace",
      icon: Blocks,
      x: 20,
      y: 25,
      desc: "Central management of venture records, stages, and tasks.",
    },
    {
      id: "research",
      name: "Market Intelligence",
      icon: Search,
      x: 80,
      y: 25,
      desc: "Continuous industry search and TAM modeling.",
    },
    {
      id: "docs",
      name: "Documentation Hub",
      icon: FileText,
      x: 20,
      y: 75,
      desc: "Investor deck copy, charters, and technical copy.",
    },
    {
      id: "proposal",
      name: "Proposal Gen",
      icon: Target,
      x: 80,
      y: 75,
      desc: "Corporate proposals and customer alignment pitches.",
    },
    {
      id: "reports",
      name: "SaaS Analytics",
      icon: BarChart3,
      x: 50,
      y: 90,
      desc: "Consolidated report pipelines and scoring indexes.",
    },
  ];

  const hub = {
    id: "ai-core",
    name: "Venture AI Core",
    icon: Cpu,
    x: 50,
    y: 50,
    desc: "Central orchestrator syncing all dynamic workspace data.",
  };

 return null;
}