<!-- 横向柱状图 -->
<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      chartInstance: null,
      allData: null, // 服务器返回的数据
      currentPage: 1,
      totalPage: 0,
      timerId: null
    };
  },
  mounted() {
    this.initChart();
    this.getData();
    window.addEventListener('resize', this.screenAdapter);
    // 因为初始状态和适应屏幕的titleFontSize不统一
    // 初始调用适配
    this.screenAdapter();
  },
  // 组件销毁操作
  destroyed() {
    // 清除定时器
    clearInterval(this.timerId);
    // 取消监听器
    window.removeEventListener('resize', this.screenAdapter);
  },
  methods: {
    // 初始化echartInstance对象
    initChart() {
      this.charInstance = this.$echarts.init(this.$refs.seller_ref, 'chalk');
      // 对图表进行初始化配置
      const initOption = {
        title: {
          text: '▎商家销售统计',
          left: 20,
          top: 20
        },
        grid: {
          top: '20%',
          left: '3%',
          right: '6%',
          bottom: '3%',
          // 包含坐标标签的控制
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            z: 0,
            lineStyle: {
              color: '#2D3443'
            }
          }
        },
        series: [
          {
            type: 'bar',
            // 标签效果
            label: {
              show: true,
              position: 'right',
              textStyle: {
                color: 'white'
              }
            },
            itemStyle: {
              // 渐变
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: '#5052EE'
                },
                {
                  offset: 1,
                  color: '#AB6EE5'
                }
              ])
            }
          }
        ]
      };

      this.charInstance.setOption(initOption);
      this.charInstance.on('mouseover', () => {
        clearInterval(this.timerId);
      });
      this.charInstance.on('mouseout', () => {
        this.startInterval();
      });
    },
    // 获取服务器数据
    async getData() {
      // 访问http
      const { data: ret } = await this.$http.get('seller');
      this.allData = ret;
      // 排序
      this.allData.sort((a, b) => a.value - b.value);
      console.log('ret:::', ret);
      this.totalPage =
        this.allData.length % 5 === 0
          ? this.allData.length / 5
          : this.allData.length / 5 + 1;
      this.updateChart();
      // 启动定时器
      this.startInterval();
    },
    // 更新图表
    updateChart() {
      const start = (this.currentPage - 1) * 5;
      const end = this.currentPage * 5;
      const showData = this.allData.slice(start, end);
      const sellerNames = showData.map(item => {
        return item.name;
      });
      const sellerValue = showData.map(item => {
        return item.value;
      });
      const dataOption = {
        yAxis: {
          data: sellerNames
        },

        series: [
          {
            data: sellerValue
            // 标签效果
          }
        ]
      };
      this.charInstance.setOption(dataOption);
    },
    startInterval() {
      if (this.timerId) {
        clearInterval(this.timerId);
      }
      this.timerId = setInterval(() => {
        // 换页
        this.currentPage =
          this.currentPage < this.totalPage ? this.currentPage + 1 : 1;
        this.updateChart();
      }, 3000);
    },
    screenAdapter() {
      const titleFontSize = (this.$refs.seller_ref.offsetWidth / 100) * 3.6;
      // 适配浏览器窗口变化的option
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize
            }
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0]
            }
          }
        ]
      };
      this.charInstance.setOption(adapterOption);
      // 手动调用chart的resize方法
      this.charInstance.resize();
    }
  }
};
</script>
<style lang=""></style>
