import { LitElement, html, css } from "lit";
import "./project-1-card.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";

export class Project1Analyzer extends LitElement {
  static get properties() {
    return {
      query: { type: String },
      items: { type: Array },
      metadata: { type: Object },
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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}
    `;
  }

  constructor() {
    super();
    this.query = "";
    this.items = [];
    this.metadata = null;
    this.loading = false;
    this.error = false;
  }

  async fetchData(query) {
    this.loading = true;
    this.error = false;

    try {
      const response = await fetch(query);
      if (!response.ok) throw new Error("Failed to fetch site.json");

      const data = await response.json();

      if (!data.metadata || !Array.isArray(data.items)) {
        throw new Error("Invalid site.json format");
      }

      this.metadata = data.metadata;
      this.items = data.items;
    } catch (error) {
      console.error("Error fetching data:", error);
      this.error = true;
    } finally {
      this.loading = false;
    }
  }


  handleSearch() {
    if (!this.query || !this.query.startsWith("http")) {
        this.error = true;
        return;
    }
    this.fetchData(this.query);
}

  renderOverview() {
    if (!this.metadata) return null;

    return html`
      <div class="overview">
        <h3>${this.metadata.name || "Untitled Site"}</h3>
        <p>Description: ${this.metadata.description || "No description available."}</p>
        <p>
          <simple-icon icon="icons:link"></simple-icon>
          Theme: ${this.metadata.theme || "N/A"}
        </p>
        <p>Created: ${this.metadata.created || "N/A"}</p>
        <p>Last Updated: ${this.metadata.updated || "N/A"}</p>
      </div>
    `;
  }

  renderCards() {
    if (!this.items || this.items.length === 0) return html`<p>No results found.</p>`;
  
    return html`
      <div class="cards">
        ${this.items.map((item) => {
          // Use https://haxtheweb.org/ as the base URL for content and source links
          const baseUrl = "https://haxtheweb.org/";
          const contentUrl = item.url ? new URL(item.url, baseUrl).href : baseUrl;
          const sourceUrl = item.sourceUrl ? new URL(item.sourceUrl, baseUrl).href : baseUrl;
  
          return html`
            <project-1-card
              .title="${item.title || "Untitled"}"
              .description="${item.description || "No description"}"
              .image="${item.image || ""}"
              .lastUpdated="${item.updated || "N/A"}"
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
      <div class="input-container">
        <input
          type="text"
          placeholder="Enter site location"
          @input="${(e) => (this.query = e.target.value)}"
        />
        <button @click="${this.handleSearch}">Analyze</button>
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