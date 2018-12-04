<template>
<div class="container pt-3 pb-4">
  <h1>Shopping List</h1>

  <div
    v-for="(item, index) in list" :key="index"
    class="row form-group"
  >
    <div class="col">
      <input
        v-model="list[index].name"
        @input="saveItem(item)"
        class="form-control"
      >
    </div>
    <div class="col-auto">
      <button
        @click="deleteItem(item._id, index)"
        class="btn btn-danger d-flex flex-col"
      >
        <i class="material-icons">delete</i>
      </button>
    </div>
  </div>

  <div
    v-if="!list.length"
    class="font-italic text-muted"
  >No items yet.</div>

  <button
    @click="addItem"
    class="btn btn-primary d-flex align-items-center"
    :class="{ disabled: waitingForResponse }"
  >
    <span v-if="waitingForResponse" class="font-italic">Adding</span>
    <i v-else class="material-icons pr-2">add</i> item
  </button>
</div>
</template>

<script>
import api from '@/api'
import debounce from 'lodash.debounce'

export default {
  data () {
    return {
      list: [],
      waitingForResponse: false
    }
  },
  created () {
    api.getItems({}).then(res => {
      this.list = res || []
    })
  },
  methods: {
    addItem () {
      api.postItem({}, {}).then(() => this.list.push({}))
    },
    saveItem: debounce(item => {
      api.putItem({ itemId: item._id }, item)
    }, 500),
    deleteItem (itemId, index) {
      this.list.splice(index, 1)
      api.deleteItem({ itemId })
    }
  }
}
</script>

<style scoped>

</style>
