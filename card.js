import { LitElement, html, css } from "lit";
import "./nasa-image.js";

export class NasaSearch extends LitElement {
  static get properties() {
    return {
      title: { type: String },
      loading: { type: Boolean, reflect: true },
      items: { type: Array },
      value: { type: String },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      :host([loading]) .results {
        opacity: 0.5;
      }

      .results {
        display: flex;
        flex-wrap: wrap;
        gap: var(--ddd-spacing-2);
      }

      details {
        margin: 16px;
        padding: 16px;
        background-color: var(--ddd-primary-3);
        color: var(--ddd-primary-17);
      }

      summary {
        font-size: var(--ddd-font-size-xl);
        font-weight: bold;
      }

      input {
        font-size: var(--ddd-font-size-md);
        line-height: 40px;
        width: 100%;
        padding: var(--ddd-spacing-2);
        border-radius: var(--ddd-radius-sm);
        border: 1px solid var(--ddd-border-color);
      }
    `;
  }

  constructor() {
    super();
    this.value = "";
    this.title = "NASA Image Search";
    this.loading = false;
    this.items = [];
  }

  inputChanged(e) {
    this.value = e.target.value;
  }

  updated(changedProperties) {
    if (changedProperties.has("value") && this.value) {
      this.updateResults(this.value);
    }
  }

  async updateResults(value) {
    this.loading = true;
    try {
      const response = await fetch(`https://images-api.nasa.gov/search?media_type=image&q=${value}`);
      const data = await response.json();
      this.items = data.collection.items || [];
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      this.loading = false;
    }
  }

  render() {
    return html`
      <h2>${this.title}</h2>
      <details open>
        <summary>Search NASA Images</summary>
        <input
          placeholder="Type keywords to search images"
          @input="${this.inputChanged}"
        />
      </details>
      <div class="results">
        ${this.items.map(
          (item) =>
            html`
              <nasa-image
                .source="${item.links[0].href}"
                .title="${item.data[0].title}"
                .alt="${item.data[0].description || item.data[0].title}"
                .secondaryCreator="${item.data[0].secondary_creator || 'NASA'}"
              ></nasa-image>
            `
        )}
      </div>
    `;
  } static get tag() {
    return "nasa-search";
  }
}
customElements.define(NasaSearch.tag, NasaSearch);