import Vue from 'vue'
declare module 'vue/types/vue' {
    interface Vue {
        $can:Function
        $currentUser:Function
    }
}
