import { LitElement, html, css } from "lit";
import "./project-1-card.js";

export class Project1Analyzer extends LitElement {
  static get properties() {
    return {
      url: { type: String },
      metadata: { type: Object },
      items: { type: Array },
      loading: { type: Boolean },
      error: { type: Boolean },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 16px;
      }

      .input-container {
        margin-bottom: 20px;
      }

      input {
        width: calc(100% - 120px);
        padding: 8px;
        font-size: 16px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }

      button {
        width: 100px;
        padding: 8px;
        font-size: 16px;
        background-color: #007acc;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }

      button:hover {
        background-color: #005fa3;
      }

      .overview {
        background: #f9f9f9;
        padding: 16px;
        border: 1px solid #ddd;
        border-radius: 4px;
        margin-bottom: 20px;
      }

      .overview h3 {
        margin: 0 0 8px 0;
      }

      .overview p {
        margin: 4px 0;
      }

      .cards {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
      }
    `;
  }

  constructor() {
    super();
    this.url = "";
    this.metadata = null;
    this.items = [];
    this.loading = false;
    this.error = false;
  }

  async analyze() {
    if (!this.url) {
      this.error = true;
      return;
    }

    this.loading = true;
    this.error = false;

    try {
      const normalizedUrl = this.url.endsWith("site.json")
        ? this.url
        : `${this.url}/site.json`;

      const response = await fetch(normalizedUrl);
      if (!response.ok) throw new Error("Failed to fetch site.json");

      const data = await response.json();

      if (!data.metadata || !Array.isArray(data.items)) {
        throw new Error("Invalid site.json format");
      }

      this.metadata = data.metadata;
      this.items = data.items;
    } catch (error) {
      console.error("Error analyzing site.json:", error);
      this.error = true;
    } finally {
      this.loading = false;
    }
  }

  renderOverview() {
    if (!this.metadata) return null;

    return html`
      <div class="overview">
        <h3>${this.metadata.name || "Untitled Site"}</h3>
        <p>Description: ${this.metadata.description || "No description available."}</p>
        <p>Theme: ${this.metadata.theme || "N/A"}</p>
        <p>Created: ${this.metadata.created || "N/A"}</p>
        <p>Last Updated: ${this.metadata.updated || "N/A"}</p>
      </div>
    `;
  }

  renderCards() {
    if (!this.items || this.items.length === 0) return null;

    return html`
      <div class="cards">
        ${this.items.map(
          (item) => html`
            <project-1-card
              .title="${item.title || "Untitled"}"
              .description="${item.description || "No description"}"
              .image="${item.image || ""}"
              .lastUpdated="${item.updated || "N/A"}"
              .contentUrl="${item.url || "#"}"
              .sourceUrl="${item.sourceUrl || "#"}"
            ></project-1-card>
          `
        )}
      </div>
    `;
  }

  render() {
    return html`
      <div class="input-container">
        <input
          type="text"
          placeholder="Enter site URL"
          @input="${(e) => (this.url = e.target.value)}"
        />
        <button @click="${this.analyze}">Analyze</button>
      </div>

      ${this.error
        ? html`<p style="color: red;">Error fetching or processing the site.json.</p>`
        : null}

      ${this.renderOverview()}
      ${this.renderCards()}
    `;
  }
}

customElements.define("project-1-analyzer", Project1Analyzer);