<script setup>
/* eslint-disable no-unused-vars */
//@ts-nocheck
import { ref, computed, nextTick, watch } from 'vue'
import { nextConsole } from '@ogen-composables/helpers/useDevTools'
const console = nextConsole('BaseScroller', {  color: '#03DB32'})

// type TScrollProps = {
// 	name: string,
// 	items: Array;
// 	scrollOffsetTop: number; // offset top in px before trigger onScrollTop
// 	scrollOffsetBottom: Boolean;  // offset bottom in px before trigger onScrollBottom
// 	scrollDefaultValue: Boolean; // default mode 'bottom' or 'top';
// 	scrollOffsetSpeedFast(): boolean; // offset scroll fast speed detection
//  transition: boolean;
//  transitionName: string;
// }

// interface IScroll {
// isScrollTop: boolean;
// isScrollBottom: boolean;
// isScrollTopAbsolute: boolean;
// scrollExist: boolean;
// scrollToTop: Function;
// scrollToBottom: Function;
// restoreScrollMinus: Function;
// }

const props = defineProps({
    name: {
        type: String,
    },
    items: {
        type: Array,
    },
    scrollOffsetTop: {
        type: Number,
        default: () => 150,
    },
    scrollOffsetBottom: {
        type: Number,
        default: () => 90,
    },
    blockMode: {
        type: Boolean,
        default: false,
    },
    timeoutStopScrolling: {
        type: Number,
        default: () => 150,
    },
    begining: {
        type: String,
        default: () => 'top',
    },
    scrollOffsetSpeedFast: {
        type: Number,
        default: () => 5,
    },
    customEvents: {
        type: Array,
        default: null,
    },
    transition: {
        type: Boolean,
        default: () => false,
    },
    transitionName: {
        type: String,
        default: 'fade',
    },
})

const emit = defineEmits([
    'onScrollTop',
    'onScrollTopAbsolute',
    'onScrollBottom',
    'onScrollBottomAbsolute',
    'onScrollBetween',
    'onScrollMiddle',
    'onScrolling',
    'onScrollingFast',
    'onStopScrolling',
    'onScrollingTo',
])

const refScroller = ref(null)
const isFirstScroll = ref(true);
const isEnabledScrollController = ref(false)
const isScrollTop = ref(props.begining === 'top' ? true : false)
const isScrollTopAbsolute = ref(props.begining === 'top' ? true : false)
const isScrollBottom = ref(props.begining === 'bottom' ? false : true)
const isScrollBottomAbsolute = ref(props.begining === 'bottom' ? true : false)
const isScrollBetween = ref(false)
const isScrollMiddle = ref(false)
const isScrolling = ref(false)
const isScrollingTop = ref(false)
const isScrollingBottom = ref(false)
const isScrollingFast = ref(false)

const middleScrollPassedFrom = ref(null);

const timeoutTriggerStopScrolling = ref(null)
const scrollHeightMinus = ref(0)

const lastPercentCalculated = ref(0)
const lastScrollDiff = ref(0)

const scrollHeight = ref(0)
const clientHeight = ref(0)
const scrollTop = ref(0)

const nextScrollAfterChange = ref(true)
let lastScrollTime = 0
let lastScrollPosition = 0
let scrollSpeed = 0

const itemsRender = computed(() => {
    //DevNote complete optimization here
    return props.items.map(e => ({
        data: e,
        active: true,
    }))
})

watch(itemsRender, (next, last) => {
    nextTick(() => {
        if (!props.blockMode) {
            if (refScroller.value && last.length !== next.length) {
                scrollHeight.value = refScroller.value.scrollHeight
                clientHeight.value = refScroller.value.clientHeight
            }
            else if (!next.length) {
                scrollHeight.value = 0
                clientHeight.value = 0
            }
        } else {
            // console.log({
            //   diff: lastScrollDiff.value,
            //   iScrollHeight: scrollHeight.value,
            //   iClientHeight: clientHeight.value,
            //   iScrollTop: scrollTop.value,
            //   nScrollHeight: refScroller.value.scrollHeight,
            //   nClientHeight: refScroller.value.clientHeight,
            //   nScrollTop: refScroller.value.scrollTop,
            // })

            if (refScroller.value && next.length && last.length === next.length) {
                if (isScrolling.value && isScrollingTop.value) {
                    const next =
                        clientHeight.value - refScroller.value.clientHeight + scrollTop.value + lastScrollDiff.value
                    if (next) refScroller.value.scrollTop = next
                } else if (isScrolling.value && isScrollingBottom.value) {
                    refScroller.value.scrollTop = refScroller.value.scrollTop - lastScrollDiff.value
                }
            } else if (!next.length || last.length !== next.length) {
                if (isScrollingTop.value) {
                    if (scrollHeight.value - refScroller.value.scrollHeight > 100) {
                        lastScrollDiff.value = scrollHeight.value - refScroller.value.scrollHeight
                    }
                }
                if (isScrollingBottom.value) {
                    if (refScroller.value.scrollHeight - scrollHeight.value > 100) {
                        lastScrollDiff.value = refScroller.value.scrollHeight - scrollHeight.value
                    }
                }
            }
        }
        if (!nextScrollAfterChange.value) nextScrollAfterChange.value = true
    })
})

const scrollExist = computed(() => {
    if (scrollHeight.value > clientHeight.value) {
        return true
    } else {
        return false
    }
})

const resetScroll = () => {
    isScrollTop.value = props.begining === 'top' ? true : false
    isScrollTopAbsolute.value = props.begining === 'top' ? true : false
    isScrollBottom.value = props.begining === 'bottom' ? true : false
    isScrollBetween.value = false
    isScrollingFast.value = false
    scrollHeightMinus.value = 0
    if (props.blockMode && refScroller.value) {
      refScroller.value.scrollTop = 0;
    }
}

const toggleScrollController = value => {
    isEnabledScrollController.value = value
    if (!value) {
        if (props.begining === 'top') {
            isScrollTop.value = true
            isScrollTopAbsolute.value = true
            isScrollBottom.value = false
            isScrollBetween.value = false
        }
        if (props.begining === 'bottom') {
            isScrollTop.value = false
            isScrollTopAbsolute.value = false
            isScrollBottom.value = true
            isScrollBetween.value = false
        }
    }
}

const onScroll = event => {
    const element = event.target
    const elScrollTop = element.scrollTop
    const elClientHeight = element.clientHeight
    const elScrollHeight = element.scrollHeight
    memorizeScrollMinus()

    scrollHeight.value = elScrollHeight
    clientHeight.value = elClientHeight

    const diffDirectionScroll = scrollTop.value - elScrollTop
    if (diffDirectionScroll > 0 && diffDirectionScroll < 150 && !isScrollingTop.value) scrollingToTop()
    else if (diffDirectionScroll <= 0 && diffDirectionScroll > -150 && !isScrollingBottom.value) scrollingToBottom()

    scrollTop.value = elScrollTop

    if (!isEnabledScrollController.value) return

    if (!isScrolling.value) onScrolling()
    clearTimeout(timeoutTriggerStopScrolling.value)
    timeoutTriggerStopScrolling.value = setTimeout(() => {
        onStopScrolling()
    }, props.timeoutStopScrolling)

    const scrollIsEnoughBig = props.blockMode ? ((elScrollHeight / 2) > elClientHeight) : true;

    const scrollIsTop = scrollIsEnoughBig
        ? elScrollTop - (props.scrollOffsetTop + itemsRender.value.length * 2 || 0) <= 0
        : elScrollTop === 0

    const scrollIsBottom = elScrollTop + elClientHeight >= elScrollHeight - props.scrollOffsetBottom

    let scrollIsMiddle = false;
    const scrollMiddlePosition = elScrollHeight / 2



    if (isScrollingTop.value && !middleScrollPassedFrom.value || middleScrollPassedFrom.value !== "bottom") {
      if ( elClientHeight/2 + elScrollTop < scrollMiddlePosition) {
        // console.log('I AM SCROLLING TOP AND PASSING MIDDLE')
        middleScrollPassedFrom.value = "bottom"
        scrollIsMiddle = true;
      }
    }
      else if (isScrollingBottom.value && !middleScrollPassedFrom.value || middleScrollPassedFrom.value !== "top") {
        if ( elClientHeight/2 + elScrollTop > scrollMiddlePosition) {
          // console.log('I AM SCROLLING BOTTOM AND PASSING MIDDLE');
          middleScrollPassedFrom.value = "top"
          scrollIsMiddle = true;
        }
      }

  // console.log('onScroll', {
  //   elScrollTop,
  //   elScrollHeight,
  //   elClientHeight,
  //   scrollMiddlePosition,
  //   scrollIsTop,
  //   scrollIsMiddle,
  //   scrollIsBottom,
  //   isScrollingBottom: isScrollingBottom.value,
  //   isScrollingTop: isScrollingTop.value,
  // })

  if (props.customEvents) {
        const currentPercent = Math.round((elScrollTop / elScrollHeight) * 100)
        if (lastPercentCalculated.value !== currentPercent) {
            lastPercentCalculated.value = currentPercent
            for (let event of props.customEvents) {
                if (event.percent === currentPercent) event.method()
            }
        }
    }
    /**
     * If Scroll is TOP
     */

    if (scrollIsTop) {
        if (isScrollBetween.value) isScrollBetween.value = false
        if (isScrollBottomAbsolute.value) isScrollBottomAbsolute.value = false
        if (isScrollBottom.value) {
            isScrollBottom.value = false
            return
        }

        if (elScrollTop <= 0 && !isScrollTopAbsolute.value) {
            isScrollTopAbsolute.value = true
            onScrollTopAbsolute()
        }
        if (!isScrollTop.value) {
            isScrollTop.value = true
            onScrollTop()
        }
    } else if (scrollIsBottom) {
        /**
         * If Scroll is BOTTOM
         */
        if (isScrollTopAbsolute.value) isScrollTopAbsolute.value = false
        if (isScrollBetween.value) isScrollBetween.value = false
        if (isScrollTop.value) isScrollTop.value = false
        if (!isScrollBottom.value) {
            isScrollBottom.value = true
            onScrollBottom()
        }
        if (elScrollTop + elClientHeight >= (elScrollHeight-1)  && !isScrollTopAbsolute.value) {
          isScrollBottomAbsolute.value = true
          onScrollBottomAbsolute()
        }
    } else {
        /**
         * If Scroll between BOTTOM and TOP
         */
        const currentTime = new Date().getTime()
        const timeDifference = currentTime - lastScrollTime
        const positionDifference = elScrollTop - lastScrollPosition
        scrollSpeed = Math.abs(positionDifference / timeDifference)

        lastScrollTime = currentTime
        lastScrollPosition = elScrollTop

        if (isScrollTopAbsolute.value) isScrollTopAbsolute.value = false
        if (isScrollBottomAbsolute.value) isScrollBottomAbsolute.value = false
        if (isScrollBottom.value) isScrollBottom.value = false
        if (isScrollTop.value) isScrollTop.value = false
        if (!isScrollBetween.value) {
            isScrollBetween.value = true
            onScrollBetween()
        }
        if (scrollIsMiddle) onScrollMiddle()

        if (!nextScrollAfterChange.value && isScrollingBottom.value && scrollSpeed > props.scrollOffsetSpeedFast) {
            if (!isScrollingFast.value) isScrollingFast.value = true
        } else if (!nextScrollAfterChange.value && isScrollingTop.value && scrollSpeed > props.scrollOffsetSpeedFast) {
            if (!isScrollingFast.value) isScrollingFast.value = true
        }
    }
    if (nextScrollAfterChange.value) nextScrollAfterChange.value = false
    if (isFirstScroll.value) isFirstScroll.value = false;
}

watch(isScrollingFast, next => {
    if (next) emit('onScrollingFast')
})

const scrollToTop = () => {
    nextTick(() => {
        if (refScroller.value) refScroller.value.scrollTo({ top: 0, behavior: 'smooth' })
    })
}

const scrollToBottom = (smooth = true) => {
    nextTick(() => {
        if (refScroller.value) {
            refScroller.value.scrollTo({
                top: refScroller.value.scrollHeight,
                behavior: smooth ? 'smooth' : 'auto',
            })
        }
    })
}

const onScrollTop = () => {
    emit('onScrollTop')
}

const onScrollTopAbsolute = () => {
    emit('onScrollTopAbsolute')
}

const onScrollBottom = () => {
    emit('onScrollBottom')
}

const onScrollBottomAbsolute = () => {
  emit('onScrollBottomAbsolute');
}

const onScrollBetween = () => {
    emit('onScrollBetween')
}

const onScrollMiddle = () => {
    if (!isScrollMiddle.value) isScrollMiddle.value = true
    emit('onScrollMiddle')
}
const onScrolling = () => {
    if (!isScrolling.value) {
        isScrolling.value = true
        emit('onScrolling')
    }
}

const onStopScrolling = () => {
    if (isScrolling.value) {
        isScrolling.value = false
        isScrollingFast.value = false
        emit('onStopScrolling')
    }
}

const scrollingToTop = () => {
    if (!isScrollingTop.value) {
        isScrollingTop.value = true
        isScrollingBottom.value = false
        emit('onScrollingTo', 'top')
    }
}
const scrollingToBottom = () => {
    if (!isScrollingBottom.value) {
        isScrollingTop.value = false
        isScrollingBottom.value = true
        emit('onScrollingTo', 'bottom')
    }
}
const memorizeScrollMinus = () => {
    scrollHeightMinus.value = refScroller.value.scrollHeight - refScroller.value.scrollTop
}
const restoreScrollMinus = () => {
    refScroller.value.scrollTop = refScroller.value.scrollHeight - scrollHeightMinus.value
    isScrollTop.value = false
    isScrollTopAbsolute.value = false
}

const scrollTo = id => {
    //   let filtered = this.items.filter(msg => msg.timestamp > props.room.lastread);
    // if (filtered.length > 0 && refScroller) refScroller.$el.scrollToIndex(this.items.indexOf(filtered[0]))
}

const getScrollPosition = () => {
    if (refScroller.value) {
        return scrollTop.value
    }
    return null
}

const scrollToY = (value, smooth = true) => {
    if (refScroller.value) refScroller.value.scrollTo({ top: value, behavior: smooth ? 'smooth' : 'auto' })
}

defineExpose({
    isScrollTop,
    isScrollBottom,
    isScrollTopAbsolute,
    scrollExist,
    scrollToTop,
    scrollToBottom,
    restoreScrollMinus,
    resetScroll,
    toggleScrollController,
    getScrollPosition,
    scrollToY,
})
</script>

<template>
    <div ref="refScroller" class="base-scroller" :class="[{ bottom: props.begining === 'bottom' }]" @scroll="onScroll">
        <template v-if="transition">
            <transition-group :name="transition ? transitionName : null" mode="out-in">
                <template v-for="(item, index) in itemsRender">
                    <slot
                        name="item"
                        :index="index"
                        :item="item.data"
                        :next-item="itemsRender[index + 1]?.data || null"
                        :last-item="itemsRender[index - 1]?.data || null"
                        :active="item.active"
                    />
                    <slot />
                </template>
            </transition-group>
        </template>

        <template v-else>
            <template v-for="(item, index) in itemsRender">
                <slot
                    name="item"
                    :index="index"
                    :item="item.data"
                    :next-item="itemsRender[index + 1]?.data || null"
                    :last-item="itemsRender[index - 1]?.data || null"
                    :active="item.active"
                />
                <slot />
            </template>
        </template>
    </div>
</template>

<style lang="scss">
.base-scroller {
    scrollbar-gutter: stable;
    &.bottom > :first-child {
        margin-top: auto !important;
    }
}
</style>
