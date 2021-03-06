'use strict';

describe('In Ceilometer View', () => {
  
  var scope, element, vm, httpBackend;

  beforeEach(module('xos.ceilometerDashboard'));
  beforeEach(module('templates'));

  beforeEach(inject(($httpBackend, $rootScope) => {
    httpBackend = $httpBackend;
    scope = $rootScope.$new();
  }))

  describe('The dashboard', () => {
    beforeEach(inject(function($httpBackend, $compile){
      element = angular.element('<ceilometer-dashboard></ceilometer-dashboard>');
      $compile(element)(scope);
      scope.$digest();
      vm = element.isolateScope().vm;
      httpBackend.flush();
    }));

    describe('when loading meters', () => {
      it('should group meters by services', () => {
        expect(Object.keys(vm.projects).length).toBe(2);
      });

      it('should group services by slices', () => {
        expect(Object.keys(vm.projects.service_2).length).toBe(2);
      });

      it('should group slices by resources', () => {
        expect(Object.keys(vm.projects.service_2.slice_2).length).toBe(2);
      });
    });
  });

  describe('the sample view', () => {
    beforeEach(inject(function($httpBackend, $compile, $stateParams){

      $stateParams.name = 'fakeName';
      $stateParams.tenant = 'fakeTenant';

      element = angular.element('<ceilometer-samples></ceilometer-samples>');
      $compile(element)(scope);
      scope.$digest();
      vm = element.isolateScope().vm;
      httpBackend.flush();
    }));

    it('should group samples by resource_id', () => {
      expect(Object.keys(vm.samplesList.fakeTenant).length).toBe(2)
      expect(Object.keys(vm.samplesList.anotherTenant).length).toBe(3)
      expect(Object.keys(vm.samplesList.thirdTenant).length).toBe(1)
    });

    it('should add the comparable samples to the dropdown list', () => {
      expect(vm.sampleLabels[0].id).toEqual('anotherTenant')
      expect(vm.sampleLabels[1].id).toEqual('thirdTenant')
    });

    it('should add the selected meter to the chart', () => {
      expect(vm.chart.labels.length).toBe(2);
      expect(vm.chart.series[0]).toBe('fakeTenant');
      expect(vm.chart.data[0].length).toBe(2);
      expect(vm.chart.data[0][0]).toBe(110);
      expect(vm.chart.data[0][1]).toBe(120);
      expect(vm.chartMeters[0].project_id).toBe('fakeTenant')
      expect(vm.chartMeters[0].resource_name).toBe('fakeName')
    });

    it('should add a sample to the chart', () => {
      vm.addMeterToChart('anotherTenant');
      expect(vm.chart.labels.length).toBe(3);
      expect(vm.chart.data[1].length).toBe(3);
      expect(vm.chart.data[1][0]).toBe(210);
      expect(vm.chart.data[1][1]).toBe(220);
      expect(vm.chart.data[1][2]).toBe(230);
      expect(vm.chartMeters[1].project_id).toBe('anotherTenant')
      expect(vm.chartMeters[1].resource_name).toBe('anotherName')
    });

    it('should remove a sample from the chart', () => {
      // for simplyvity add a tenant (it's tested)
      vm.addMeterToChart('anotherTenant');
      vm.removeFromChart(vm.chartMeters[0]);
      expect(vm.chart.data[0].length).toBe(3);
      expect(vm.chart.data[0][0]).toBe(210);
      expect(vm.chart.data[0][1]).toBe(220);
      expect(vm.chart.data[0][2]).toBe(230);
      expect(vm.chartMeters[0].project_id).toBe('anotherTenant')
      expect(vm.chartMeters[0].resource_name).toBe('anotherName')
    });

    describe('The format sample labels method', () => {
      it('should create an array of unique labels', () => {
        // unique because every resource has multiple samples (time-series)
        const samples = [
          {project_id: 1, resource_name: 'fakeName'},
          {project_id: 1, resource_name: 'fakeName'},
          {project_id: 2, resource_name: 'anotherName'},
          {project_id: 2, resource_name: 'anotherName'}
        ];

        const result = vm.formatSamplesLabels(samples);

        expect(result.length).toBe(2);
        expect(result[0]).toEqual({id: 1, name: 'fakeName'});
        expect(result[1]).toEqual({id: 2, name: 'anotherName'});
      });
    });
  });
});

describe('The orderObjectByKey filter', () => {
  var $filter;

  beforeEach(function () {
    module('xos.ceilometerDashboard');

    inject(function (_$filter_) {
      $filter = _$filter_;
    });
  });

  it('should order an object by the key value', function () {
    // Arrange.
    const list = {c: 3, b: 2, a: 1};

    // call the filter function
    const result = $filter('orderObjectByKey')(list);

    // Assert.
    expect(result).toEqual({a: 1, b: 2, c: 3});
  });
});