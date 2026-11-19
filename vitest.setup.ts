// Vitest setup: jest-dom matchers, and unmount rendered components after each
// test so component tests do not leak DOM into one another.

import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(cleanup);
