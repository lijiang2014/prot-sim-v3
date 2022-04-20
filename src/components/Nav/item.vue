<script lang="ts" >
import { defineComponent, h } from 'vue'
export default defineComponent({
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render() {
    let icontext = []
    console.log(this.$props)
    if (this.$props.icon) {
      icontext.push(
        h('svg-icon', { "icon-class": this.$props.icon})
      )
    }
    if (this.$props.title) {
      icontext.push(
        h('span', { "slot": 'title'}, this.$props.title)
      )
    }
    return h('div',{},icontext)
  },
})
</script>