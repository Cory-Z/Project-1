/**
 * Copyright 2024 Cory Zavod
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `project-1-zavod`
 * 
 * @demo index.html
 * @element project-1-zavod
 */
export class Project1Zavod extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "project-1-zavod";
  }

  constructor() {
    super();
    this.title = "";
    this.siteDetails = {}; // Stores site metadata like name, theme, etc.
    this.items = []; // Stores the items to display as cards
    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "Site Analyzer",
      noData: "No data to display.",
      loading: "Loading...",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/project-1-zavod.ar.json", import.meta.url).href +
        "/../",
      locales: ["ar", "es", "hi", "zh"],
    });
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      siteDetails: { type: Object },
      items: { type: Array },
      loading: { type: Boolean },
      error: { type: Boolean },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          color: var(--ddd-theme-primary);
          background-color: var(--ddd-theme-accent);
          font-family: var(--ddd-font-navigation);
        }
        .wrapper {
          margin: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-4);
        }
        .input-container {
          margin-bottom: var(--ddd-spacing-2);
          display: flex;
          gap: var(--ddd-spacing-2);
        }
        input {
          flex: 1;
          padding: var(--ddd-spacing-2);
          font-size: var(--ddd-font-size-m);
          border: 1px solid var(--ddd-theme-border);
          border-radius: var(--ddd-radius-m);
        }
        button {
          padding: var(--ddd-spacing-2);
          background-color: var(--ddd-theme-secondary);
          color: #fff;
          border: none;
          border-radius: var(--ddd-radius-m);
          cursor: pointer;
        }
        button:hover {
          background-color: var(--ddd-theme-secondary-dark);
        }
        .overview {
          margin-top: var(--ddd-spacing-4);
          padding: var(--ddd-spacing-4);
          background: var(--ddd-theme-surface);
          border: 1px solid var(--ddd-theme-border);
          border-radius: var(--ddd-radius-m);
        }
        .cards {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-4);
          margin-top: var(--ddd-spacing-4);
        }
        .loading {
          font-size: var(--ddd-font-size-m);
          color: var(--ddd-theme-secondary);
        }
        .error {
          color: red;
        }
      `,
    ];
  }

  /**
   * Fetches and processes the site.json data.
   */
  async fetchSiteData(query) {
    this.loading = true;
    this.error = false;
    this.items = [];
    this.siteDetails = {};

    try {
      const normalizedUrl = query.endsWith("site.json")
        ? query
        : `${query}/site.json`;

      const response = await fetch(normalizedUrl);
      if (!response.ok) throw new Error("Failed to fetch site.json");

      const data = await response.json();

      if (!data.metadata || !Array.isArray(data.items)) {
        throw new Error("Invalid site.json format");
      }

      this.siteDetails = data.metadata;
      this.items = data.items;
    } catch (err) {
      console.error("Error fetching site.json:", err);
      this.error = true;
    } finally {
      this.loading = false;
    }
  }

  /**
   * Handles the "Analyze" button click.
   */
  handleAnalyze() {
    const inputField = this.shadowRoot.querySelector("input");
    if (!inputField.value) {
      this.error = true;
      return;
    }
    this.fetchSiteData(inputField.value);
  }

  /**
   * Renders the site overview.
   */
  renderOverview() {
    if (!this.siteDetails.name) return null;

    return html`
      <div class="overview">
        <h3>${this.siteDetails.name}</h3>
        <p>Description: ${this.siteDetails.description || "N/A"}</p>
        <p>Theme: ${this.siteDetails.theme || "N/A"}</p>
        <p>Created: ${this.siteDetails.created || "N/A"}</p>
        <p>Last Updated: ${this.siteDetails.updated || "N/A"}</p>
      </div>
    `;
  }

  /**
   * Renders the cards.
   */
  renderCards() {
    if (!this.items || this.items.length === 0) {
      return html`<p>${this.t.noData}</p>`;
    }

    return html`
      <div class="cards">
        ${this.items.map(
          (item) => html`
            <project-1-card
              .title="${item.title || "Untitled"}"
              .description="${item.description || "No description"}"
              .image="${item.image || ""}"
              .contentUrl="${item.url || "#"}"
              .sourceUrl="${item.sourceUrl || "#"}"
            ></project-1-card>
          `
        )}
      </div>
    `;
  }

  // Lit render the HTML
  render() {
    return html`
      <div class="wrapper">
        <h3>${this.t.title}</h3>
        <div class="input-container">
          <input type="text" placeholder="Enter site location" />
          <button @click="${this.handleAnalyze}">Analyze</button>
        </div>

        ${this.loading
          ? html`<p class="loading">${this.t.loading}</p>`
          : this.renderOverview()}

        ${this.error
          ? html`<p class="error">Error fetching or processing the data.</p>`
          : this.renderCards()}
      </div>
    `;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(Project1Zavod.tag, Project1Zavod);