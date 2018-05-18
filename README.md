# flexbox-grid

A responsive SASS grid system that utilises flexbox and fluid spacings.

## Defaults 
```scss
/*  ---------------------------------------------------
    Breakpoints
------------------------------------------------------- */

$mobile: 420px !default;
$tablet: 768px !default;
$tablet-landscape: 1024px !default;
$desktop: 1366px !default;
$desktop-large: 1560px !default;

/*  ---------------------------------------------------
    Grid
------------------------------------------------------- */

$grid-cols: 12 !default;

$col-spacing-large: 30px !default;
$col-spacing-small: 10px !default;

$col-spacing-large-narrow: 10px !default;
$col-spacing-small-narrow: 5px !default;

$col-sm-start: $tablet !default;
$col-md-start: $tablet-landscape !default;
$col-lg-start: $desktop !default;
$col-xl-start: $desktop-large !default;

$col-clip-low: $mobile !default;
$col-clip-high: $col-md-start !default;

$col-sizes: 'xs', 'sm', 'md', 'lg', 'xl';
$col-breakpoints: '0px', $col-sm-start, $col-md-start, $col-lg-start, $col-xl-start;
```

## Responsive
Responsive modifiers enable specifying different column sizes, offsets, alignment and distribution at xs, sm, md, lg & xl viewport widths.

```html
<div class="row">
  <div class="col-xs-12 col-sm-8 col-md-7 col-lg-2 col-xl-4">Responsive</div>
</div>
```

## Fluid
Percent based widths allow fluid resizing of columns and rows.

Fluid column spacing blends column spacing between narrow spacing on mobile and wide spacing on desktop.


## Offsets
Offset columns responsively.

```html
<div class="row">
  <div class="col-xs-9 col-xs-offset-3 col-md-7 col-md-offset-2">Offsets</div>
</div>
```

## Automatic width
Add any number of auto sizing columns to a row. Let the grid figure it out.

```html
<div class="row">
  <div class="col-xs-3">Set width</div>
  <div class="col-xs">Auto width</div>
  <div class="col-xs-2">Set width</div>
</div>
```

## Nested grids
Nest grids inside grids inside grids.

```html
<div class="row">
  <div class="col-xs">
    <div class="row">
      <div class="col-xs">auto</div>
    </div>
  </div>
</div>
```

## Alignment
Add classes to align elements to the start or end of a row as well as the top, bottom, or center of a column.

### .start-
```html
<div class="row start-xs">
  <div class="col-xs-6">start</div>
</div>
```


### .center-
```html
<div class="row center-xs">
  <div class="col-xs-6">center</div>
</div>
```

### .end-
```html
<div class="row end-xs">
  <div class="col-xs-6">center</div>
</div>
```

### .top-
```html
<div class="row top-xs">
  <div class="col-xs-6">center</div>
</div>
```

### .middle-
```html
<div class="row middle-xs">
  <div class="col-xs-6">center</div>
</div>
```

### .bottom-
```html
<div class="row bottom-xs">
  <div class="col-xs-6">center</div>
</div>
```

## Distribution
Add classes to distribute the contents of a row or column.

### .around-
```html
<div class="row around-xs">
  <div class="col-xs-2">around</div>
  <div class="col-xs-2">around</div>
  <div class="col-xs-2">around</div>
</div>
```

### .between-
```html
<div class="row between-xs">
  <div class="col-xs-2">between</div>
  <div class="col-xs-2">between</div>
  <div class="col-xs-2">between</div>
</div>
```

## Reordering
Add classes to reorder columns.

### .first-
Forces column to appear first.

```html
<div class="row">
  <div class="col-xs-2">1</div>
  <div class="col-xs-2">2</div>
  <div class="col-xs-2 first-xs">3</div>
</div>
```

### .last-
Forces column to appear last.

```html
<div class="row">
  <div class="col-xs-2 last-xs">1</div>
  <div class="col-xs-2">2</div>
  <div class="col-xs-2">3</div>
</div>
```

### .initial-order-
Resets a column to its initial order.

```html
<div class="row">
  <div class="col-xs-2">1</div>
  <div class="col-xs-2">2</div>
  <div class="col-xs-2 first-xs initial-order-sm">3</div>
</div>
```

## Reversing

### .reverse
```html
<div class="row reverse">
  <div class="col-xs-2">1</div>
  <div class="col-xs-2">2</div>
  <div class="col-xs-2">3</div>
</div>
```

## Hiding

### .hidden-
```html
<div class="row">
  <div class="col-xs">
    <div class="hidden-xs">xs</div>
  </div>
  <div class="col-xs">
    <div class="hidden-sm">sm</div>
  </div>
  <div class="col-xs">
    <div class="hidden-md">md</div>
  </div>
  <div class="col-xs">
    <div class="hidden-lg">lg</div>
  </div>
  <div class="col-xs">
    <div class="hidden-xl">xl</div>
  </div>
</div>
```
