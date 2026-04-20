"use client";

import { useState } from "react";

const labelCls = "block text-sm font-medium text-zinc-900";
const helpCls = "mt-1 text-xs text-zinc-500";
const fieldCls = "mt-3 space-y-2";
const radioRowCls = "flex items-center gap-2 text-sm text-zinc-800";
const inputCls =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500";

export default function AssessForm() {
  const [regulatedAny, setRegulatedAny] = useState(false);
  const [clientFacing, setClientFacing] = useState("no");

  return (
    <form action="/result" method="get" className="space-y-8">
      <div>
        <label htmlFor="description" className={labelCls}>
          Describe the use case
        </label>
        <p className={helpCls}>
          Used for your summary. Classification is based on the structured
          answers below.
        </p>
        <div className={fieldCls}>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            className={inputCls}
            placeholder="What does the AI do, in one or two sentences?"
          />
        </div>
      </div>

      <div>
        <span className={labelCls}>Who operates this AI tool</span>
        <div className={fieldCls}>
          {(["internal", "external", "both"] as const).map((v) => (
            <label key={v} className={radioRowCls}>
              <input
                type="radio"
                name="audience"
                value={v}
                defaultChecked={v === "internal"}
                required
              />
              {v === "internal"
                ? "Internal staff only"
                : v === "external"
                  ? "External users (agents, vendors, clients operating self-service)"
                  : "Both internal and external"}
            </label>
          ))}
        </div>
      </div>

      <div>
        <span className={labelCls}>
          Does any AI-generated output reach a client or policyholder
        </span>
        <div className={fieldCls}>
          {(["yes", "no"] as const).map((v) => (
            <label key={v} className={radioRowCls}>
              <input
                type="radio"
                name="client_facing"
                value={v}
                defaultChecked={v === "no"}
                onChange={() => setClientFacing(v)}
                required
              />
              {v === "yes" ? "Yes" : "No"}
            </label>
          ))}
        </div>
      </div>

      <div>
        <span className={labelCls}>
          Does it touch regulated decisions (select all that apply)
        </span>
        <p className={helpCls}>
          Pricing, coverage, and claims are regulated in every U.S. state.
        </p>
        <div className={fieldCls}>
          {(
            [
              ["pricing", "Pricing"],
              ["coverage", "Coverage"],
              ["claims", "Claims"],
            ] as const
          ).map(([v, label]) => (
            <label key={v} className={radioRowCls}>
              <input
                type="checkbox"
                name="regulated_domains"
                value={v}
                onChange={(e) => {
                  const any = e.currentTarget.form
                    ? Array.from(
                        e.currentTarget.form.querySelectorAll<HTMLInputElement>(
                          "input[name='regulated_domains']",
                        ),
                      ).some((el) => el.checked)
                    : false;
                  setRegulatedAny(any);
                }}
              />
              {label}
            </label>
          ))}
          <label className={radioRowCls}>
            <input
              type="checkbox"
              name="regulated_none"
              value="none"
              onChange={() => {
                /* cosmetic only; absence of regulated_domains is treated as none */
              }}
            />
            None of these
          </label>
        </div>
      </div>

      {regulatedAny && (
        <div>
          <span className={labelCls}>
            On that regulated decision, what does the AI do
          </span>
          <p className={helpCls}>
            Deciding without a human review is prohibited by most insurance
            regulators.
          </p>
          <div className={fieldCls}>
            {(
              [
                ["recommend", "Recommends — a human decides"],
                [
                  "decide_with_review",
                  "Decides — a human reviews every decision before it takes effect",
                ],
                [
                  "decide_without_review",
                  "Decides — no human review before it takes effect",
                ],
              ] as const
            ).map(([v, label]) => (
              <label key={v} className={radioRowCls}>
                <input
                  type="radio"
                  name="decision_authority"
                  value={v}
                  defaultChecked={v === "recommend"}
                  required={regulatedAny}
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      )}

      <div>
        <span className={labelCls}>Is the AI generative or classifying</span>
        <p className={helpCls}>
          Generative produces new text, images, or code. Classifying assigns a
          category, score, or prediction.
        </p>
        <div className={fieldCls}>
          {(
            [
              ["generative", "Generative"],
              ["classifying", "Classifying"],
            ] as const
          ).map(([v, label]) => (
            <label key={v} className={radioRowCls}>
              <input
                type="radio"
                name="ai_mode"
                value={v}
                defaultChecked={v === "classifying"}
                required
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {clientFacing === "yes" && (
        <div>
          <span className={labelCls}>
            Does a human review AI output before it reaches the client
          </span>
          <div className={fieldCls}>
            {(
              [
                ["yes", "Yes — every output is reviewed before it is sent"],
                ["no", "No — AI output goes to the client directly"],
              ] as const
            ).map(([v, label]) => (
              <label key={v} className={radioRowCls}>
                <input
                  type="radio"
                  name="human_review_before_external_output"
                  value={v}
                  defaultChecked={v === "yes"}
                  required={clientFacing === "yes"}
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      )}

      <div>
        <span className={labelCls}>Source of training data or prompts</span>
        <div className={fieldCls}>
          {(
            [
              ["vendor_documented", "Vendor-documented (model card or data sheet provided)"],
              ["internal_curated", "Internally curated (your own data, reviewed)"],
              ["public_unknown", "Public data with unknown curation"],
              ["unknown", "Unknown"],
            ] as const
          ).map(([v, label]) => (
            <label key={v} className={radioRowCls}>
              <input
                type="radio"
                name="data_source"
                value={v}
                defaultChecked={v === "vendor_documented"}
                required
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <span className={labelCls}>
          Is logging of inputs and outputs in place
        </span>
        <div className={fieldCls}>
          {(["yes", "no"] as const).map((v) => (
            <label key={v} className={radioRowCls}>
              <input
                type="radio"
                name="logging"
                value={v}
                defaultChecked={v === "yes"}
                required
              />
              {v === "yes" ? "Yes" : "No"}
            </label>
          ))}
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Classify
        </button>
      </div>
    </form>
  );
}
