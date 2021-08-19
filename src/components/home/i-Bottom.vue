<template>
  <el-row
    :gutter="40"
    class="panel-group"
  >
    <el-col
      :xs="8"
      :sm="8"
      :lg="4"
      class="card-panel-col"
    >
      <div
        class="card-panel-n icon-goods"
        @click="handleClick('/product/import')"
      >
        <div class="card-panel-wrapper">
          <div class="card-panel-icon-wrapper-n">
            <i class="el-icon-goods card-panel-icon-n" />
          </div>
          <div class="card-panel-text">
            添加商品
          </div>
        </div>
      </div>
    </el-col>
    <el-col
      :xs="8"
      :sm="8"
      :lg="4"
      class="card-panel-col"
    >
      <div
        class="card-panel-n icon-pie"
        @click="handleClick('/product/category')"
      >
        <div class="card-panel-wrapper">
          <div class="card-panel-icon-wrapper-n">
            <i class="el-icon-pie-chart card-panel-icon-n" />
          </div>
          <div class="card-panel-text">
            商品分类
          </div>
        </div>
      </div>
    </el-col>
    <el-col
      :xs="8"
      :sm="8"
      :lg="4"
      class="card-panel-col"
    >
      <div
        class="card-panel-n icon-shop"
        @click="handleClick('/scene/new')"
      >
        <div class="card-panel-wrapper">
          <div class="card-panel-icon-wrapper-n">
            <i class="el-icon-s-shop card-panel-icon-n" />
          </div>
          <div class="card-panel-text">
            添加场景
          </div>
        </div>
      </div>
    </el-col>
    <el-col
      :xs="8"
      :sm="8"
      :lg="4"
      class="card-panel-col"
    >
      <div
        class="card-panel-n icon-shopping"
        @click="handleClick('/order/index')"
      >
        <div class="card-panel-wrapper">
          <div class="card-panel-icon-wrapper-n">
            <i class="el-icon-shopping-cart-2 card-panel-icon-n" />
          </div>
          <div class="card-panel-text">
            商品订单
          </div>
        </div>
      </div>
    </el-col>
    <el-col
      :xs="8"
      :sm="8"
      :lg="4"
      class="card-panel-col"
    >
      <div
        class="card-panel-n icon-picture"
        @click="handleClick('/banner/new')"
      >
        <div class="card-panel-wrapper">
          <div class="card-panel-icon-wrapper-n">
            <i class="el-icon-picture card-panel-icon-n" />
          </div>
          <div class="card-panel-text">
            添加广告
          </div>
        </div>
      </div>
    </el-col>
    <el-col
      :xs="8"
      :sm="8"
      :lg="4"
      class="card-panel-col"
    >
      <div
        class="card-panel-n icon-document"
        @click="handleClick('/example/new')"
      >
        <div class="card-panel-wrapper">
          <div class="card-panel-icon-wrapper-n">
            <i class="el-icon-document card-panel-icon-n" />
          </div>
          <div class="card-panel-text">
            添加案例
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Order, Service } from '@/model'

@Component({
  name: 'i-Bottom'
})
export default class extends Vue {
  handleClick(url:string) {
    this.$router.push(url)
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
    text-align: center;

    .card-panel-n {
      width: 70%;
      height: 80px;
      margin:0 auto;
      background-color: #fff;
      border-radius: 8px;
      justify-content: center;
      transition: all 0.38s ease-out;
    }

    .card-panel-icon-wrapper-n {
      border-radius: 6px;
    }

    .card-panel-icon-n {
      font-size: 40px;
    }

    .card-panel-wrapper {
      padding-top: 10px;
    }

    .card-panel-text {
      line-height: 18px;
      font-size: 16px;
      margin-bottom: 12px;
      font-weight: bold;
      color:rgba(0, 0, 0, 0.45);
    }

    .icon-goods {
      color: #35cec9;
    }

    .icon-pie {
      color: #5a7cf2
    }

    .icon-shop {
      color: #fe7945;
    }

    .icon-shopping {
      color: #9254dd
    }

    .icon-picture {
      color: #71d041;
    }

    .icon-document{
      color: #fea842;
    }

    &:hover {
      .card-panel-n {
        color: #fff;
      }

      .card-panel-text {
        color: #fff
      }

      .icon-pie {
        background-color: #5a7cf2;
      }

      .icon-goods {
        background-color: #35cec9 ;
      }

      .icon-shop {
        background-color: #fe7945;
      }

      .icon-shopping {
        background-color: #9254dd;
      }

      .icon-picture{
        background-color: #71d041;
      }

      .icon-document {
        background-color: #fea842;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
