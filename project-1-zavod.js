
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";


export class Project1Zavod extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "project-1-zavod";
  }

  constructor() {
    super();
    this.title = "";
    this.siteDetails = {};
    this.items = [];
    this.loading = false;
    this.error = false;
  }


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


  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;

          background-color: var(--ddd-theme-accent);
          font-family: var(--ddd-font-navigation);
        }
        .wrapper {

          padding: var(--ddd-spacing-4);
        }

        .cards {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-4);
          margin-top: var(--ddd-spacing-4);
        }

        .error {
          color: red;
        }
      `,
    ];
  }


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


  handleAnalyze() {
    const inputField = this.shadowRoot.querySelector("input");
    if (!inputField.value) {
      this.error = true;
      return;
    }
    this.fetchSiteData(inputField.value);
  }

  renderCards() {

    if (!this.items || this.items.length === 0) {
      return html`<p>No data to display.</p>`;
    }

    return html`
      <div class="cards">
        ${this.items.map((item) => {
          const contentUrl = item.url ? new URL(item.url, location.origin).href : "#";
          const sourceUrl = item.sourceUrl
            ? new URL(item.sourceUrl, location.origin).href
            : "#";

          return html`
            <project-1-card
              .title="${item.title || "Untitled"}"
              .description="${item.description || "No description"}"
              .image="${item.image || ""}"
              .contentUrl="${contentUrl}"
              .sourceUrl="${sourceUrl}"
            ></project-1-card>
          `;
        })}
      </div>
    `;
  }


  render() {
    return html`
      <div class="wrapper">
        <h3>${this.title || "Site Analyzer"}</h3>
        <div class="input-container">
          <input type="text" placeholder="Enter site location" />
          <button @click="${this.handleAnalyze}">Analyze</button>
        </div>



        ${this.error
          ? html`<p class="error">Error fetching or processing the data.</p>`
          : null}

        ${this.renderCards()}
      </div>
    `;
  }


}

customElements.define(Project1Zavod.tag, Project1Zavod);