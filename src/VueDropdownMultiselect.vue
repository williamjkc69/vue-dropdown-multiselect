<template>
  <div class="vue-dropdown" v-clickoutside="onClose">
    <button :class="btnClassName" @click="saveLocations">
      <slot v-if="hasBtnText" name="btnText"></slot>
      <template v-else>{{ placeholderBtnText }}</template>
    </button>

    <div v-if="popupLocationFilter" :class="`bg ${containerClassName}`">
      <div class="search-container" v-if="searchable">
        <input
          v-model="stateToSearch"
          :class="`vue-search ${searchClass}`"
          :placeholder="searchPlaceholderText"
          @input="handleTyping()"
        />
      </div>

      <div class="">
        <div
          :key="index"
          v-for="(item, index) in elements"
          class="pointer"
          :class="{ hide: !item.matches }"
        >
          <p
            v-if="isChecked"
            :class="
              `item-flex pointer ${item.checked ? itemClassName : ''} ${
                item.disabled ? 'disabled' : ''
              }`
            "
          >
            <input
              class="pointer"
              type="checkbox"
              :id="item.name"
              :name="item.name"
              :value="item.name"
              :checked="item.checked && !item.disabled"
              :disabled="item.disabled"
              @click="handleSelection(item)"
            />
            <label :for="item.name" class="pointer">{{ item.name }}</label>
          </p>
          <div v-else>
            <p
              @click="handleSelection(item)"
              :for="item.name"
              :class="
                `item-flex pointer ${item.checked ? itemClassName : ''} ${
                  item.disabled ? 'disabled' : ''
                }`
              "
            >
              {{ item.name }}
            </p>
          </div>
          <div class=""></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "VueDropdownMultiselect",
  props: {
    items: {
      type: Array,
      default: () => []
    },
    multiSelect: {
      type: Boolean,
      default: false
    },
    searchable: {
      type: Boolean,
      default: false
    },
    isChecked: {
      type: Boolean,
      default: false
    },
    placeholderBtn: {
      type: String,
      default: "Select an Option"
    },
    itemClass: {
      type: String,
      default: null
    },
    searchPlaceholder: {
      type: String,
      default: "Search"
    },
    btnClass: {
      type: String,
      default: ""
    },
    containerClass: {
      type: String,
      default: ""
    },
    searchClass: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      stateToSearch: "",
      popupLocationFilter: false,
      selectedToExport: [],
      elements: []
    };
  },
  computed: {
    placeholderBtnText() {
      if (this.placeholderBtn) {
        return this.placeholderBtn;
      }
      return "Select an Option";
    },
    searchPlaceholderText() {
      if (this.searchPlaceholder) {
        return this.searchPlaceholder;
      }
      return "Search";
    },
    hasBtnText() {
      return !!this.$slots.btnText;
    },
    itemClassName() {
      if (this.itemClass) {
        return this.itemClass;
      }
      return "selected";
    },
    btnClassName() {
      if (this.btnClass) {
        return this.btnClass;
      }
      return "vue-main-btn";
    },
    containerClassName() {
      if (this.containerClass) {
        return this.containerClass;
      }
      return "vue-main-container";
    }
  },
  created() {
    this.formatItems();
  },
  methods: {
    onClose() {
      this.saveLocations();
      this.popupLocationFilter = false;
    },
    clearFilters() {
      this.elements.forEach((item) => {
        item.checked = false;
        item.matches = true;
      });

      this.stateToSearch = "";
    },
    handleTyping() {
      this.elements.forEach((item) => {
        let matchWithStateName = item.name
          .toLowerCase()
          .includes(this.stateToSearch.toLowerCase());

        item.matches = matchWithStateName ? true : false;
      });
    },
    formatItems() {
      this.elements = this.items;
      this.elements.forEach((item) => {
        item.matches = true;
        if (item.checked) {
          this.selectedToExport.push(item.value);
        } else {
          item.checked = false;
        }
        if (!item.disabled) {
          item.disabled = false;
        }
      });
      this.$emit("input", this.selectedToExport);
    },
    handleSelection(item) {
      if (item.checked) {
        item.checked = false;
        if (Array.isArray(this.selectedToExport)) {
          this.selectedToExport = this.selectedToExport.filter(
            (e) => e != item.value
          );
        }
      } else {
        if (!item.disabled) {
          if (this.multiSelect) {
            this.selectedToExport.push(item.value);
          } else {
            this.selectedToExport = [];
            this.selectedToExport.push(item.value);
            this.elements.map((i) => {
              i.checked = false;
            });
          }
          item.checked = true;
        }
      }
      this.$emit("input", this.selectedToExport);
      this.$forceUpdate();
    },
    saveLocations() {
      this.popupLocationFilter = !this.popupLocationFilter;
      if (!this.popupLocationFilter) {
        this.$emit("hidden");
      }
    },
    cleanSelected(name) {
      this.selectedToExport = this.selectedToExport.filter((e) => e != name);
      name = name.split(" (")[0];
    }
  },
  directives: {
    clickoutside: {
      bind: function(el, binding, node) {
        el.clickOutsideEvent = function(event) {
          if (!(el == event.target || el.contains(event.target))) {
            node.context[binding.expression](event);
          }
        };
        document.body.addEventListener("click", el.clickOutsideEvent);
      },
      unbind: function(el) {
        document.body.removeEventListener("click", el.clickOutsideEvent);
      },
      stopProp(event) {
        event.stopPropagation();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
body {
  --black-color: 0, 0, 0;
}

.vue-dropdown {
  position: relative;
  width: fit-content;

  .bg {
    box-shadow: 0 6px 12px RGB(var(--black-color), 0.18);
    background-color: #fff;
    border: 1px solid #ccc;
    position: absolute;
    border-radius: 4px;
    max-height: 400px;
    min-width: 300px;
    z-index: 1000;
    overflow: auto;
    width: 100%;
  }
  .vue-main-btn:hover {
    background: #e1e1e1;
  }
  .vue-main-btn {
    border: 0.5px solid #ccc;
    background: white;
    width: 100%;
    min-height: 40px;
    text-align: center;
    color: #35495e;
    min-width: 300px;
    font-size: 17px;
    cursor: pointer;
    height: 2.5rem;
  }
  .search-container {
    margin: 5px 0;
  }

  .item-flex {
    display: flex;
  }
  .hide {
    display: none;
  }
  .pointer {
    cursor: pointer;
  }
  .pointer:hover {
    color: white;
    background: #41b883;
  }
  .selected {
    background: #e1e1e1;
  }
  .disabled {
    color: #ccc;
  }
  p {
    text-align: left;
    padding: 0.5em;
    margin: 0;
  }
  label {
    text-align: left;
    margin-left: 5px;
    width: 100%;
  }
  .vue-search {
    border-width: 0 0 2px;
    border-color: #ccc;
    font-style: italic;
    margin: 5px 10px;
    height: 1.75em;
    width: 90%;
    outline: 0;
  }
  .vue-search::placeholder {
    text-align: center;
  }
}
</style>
