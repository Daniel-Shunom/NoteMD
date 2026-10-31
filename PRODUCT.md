# NoteMD

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Clinicians. The user explicitly selected the clinician workspace as the lead workflow.

## Product Purpose

Manage patients, clinical notes, medication records, and appointments in one simple workspace.

## Operating Context

The original repository has separate doctor, patient, and landing-page apps backed by MongoDB and optional AI services. The rebuild consolidates the clinician workflow. Existing code remains available as legacy source; no database migration is implied.

## Capabilities and Constraints

The user requested a severe backend and frontend rework and a functional, simple, minimalist UI. Local startup must work without MongoDB or AI credentials. Initial data is synthetic. The local workspace is a development application; authenticated multi-user hosting and real patient-data deployment remain separate work.

## Brand Commitments

Preserve the NoteMD name. Minimalist, functional, simple.

## Product Principles

- Patient context stays visible while reviewing or writing records.
- A saved record must survive a server restart.
- Every control performs a real action and reports failures.
- Use plain clinical workflow language and familiar controls.
