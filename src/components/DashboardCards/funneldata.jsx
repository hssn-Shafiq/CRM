"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"

const SalesFunnelDashboard = () => {
  const [activeTab, setActiveTab] = useState("Cumulative")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  
  // Using refs for scroll containers
  const stagesContainerRef = useRef(null)
  const verticalThumbRef = useRef(null)
  const horizontalThumbRef = useRef(null)
  const dropdownRef = useRef(null)
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    
    // Add event listener when dropdown is open
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    // Cleanup function
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen])
  
  // Update scrollbar thumbs position on scroll
  useEffect(() => {
    const stagesContainer = stagesContainerRef.current
    const verticalThumb = verticalThumbRef.current
    const horizontalThumb = horizontalThumbRef.current
    
    if (!stagesContainer || !verticalThumb || !horizontalThumb) return
    
    const handleScroll = () => {
      // Update vertical thumb position
      const verticalScrollRatio = stagesContainer.scrollTop / (stagesContainer.scrollHeight - stagesContainer.clientHeight)
      const verticalTrackHeight = verticalThumb.parentElement.clientHeight
      const verticalThumbHeight = verticalThumb.clientHeight
      const verticalThumbTop = verticalScrollRatio * (verticalTrackHeight - verticalThumbHeight)
      verticalThumb.style.top = `${verticalThumbTop}px`
      
      // Update horizontal thumb position
      const horizontalScrollRatio = stagesContainer.scrollLeft / (stagesContainer.scrollWidth - stagesContainer.clientWidth)
      const horizontalTrackWidth = horizontalThumb.parentElement.clientWidth
      const horizontalThumbWidth = horizontalThumb.clientWidth
      const horizontalThumbLeft = horizontalScrollRatio * (horizontalTrackWidth - horizontalThumbWidth)
      horizontalThumb.style.left = `${horizontalThumbLeft}px`
    }
    
    stagesContainer.addEventListener('scroll', handleScroll)
    return () => stagesContainer.removeEventListener('scroll', handleScroll)
  }, [])
  
  // Scroll handlers using refs
  const handleHorizontalScroll = (direction) => {
    if (stagesContainerRef.current) {
      const scrollAmount = 150
      if (direction === "left") {
        stagesContainerRef.current.scrollLeft -= scrollAmount
      } else {
        stagesContainerRef.current.scrollLeft += scrollAmount
      }
    }
  }

  const handleVerticalScroll = (direction) => {
    if (stagesContainerRef.current) {
      const scrollAmount = 100
      if (direction === "up") {
        stagesContainerRef.current.scrollTop -= scrollAmount
      } else {
        stagesContainerRef.current.scrollTop += scrollAmount
      }
    }
  }

  // Handle dropdown item selection
  const handleDropdownItemClick = (item) => {
    // You can add logic here to handle the selected item
    setDropdownOpen(false)
  }

  return (
    <div className="funnel-dashboard-container rounded">
      {/* Header section */}
      <div className="funnel-header-section">
        <h5 className="funnel-dashboard-title">Funnel</h5>
        <div className="funnel-dropdown-container" ref={dropdownRef}>
          <button className="funnel-dropdown-button" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <span>Customers and Job Value</span>
            <ChevronDown size={16} color="#6C757D" />
          </button>

          {dropdownOpen && (
            <div className="funnel-dropdown-menu">
              <div 
                className="funnel-dropdown-item" 
                onClick={() => handleDropdownItemClick("Customers and Job Value")}
              >
                Customers and Job Value
              </div>
              <div 
                className="funnel-dropdown-item" 
                onClick={() => handleDropdownItemClick("Revenue")}
              >
                Revenue
              </div>
              <div 
                className="funnel-dropdown-item" 
                onClick={() => handleDropdownItemClick("Conversions")}
              >
                Conversions
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="funnel-card-body">
        {/* Value section */}
        <div className="funnel-value-section">
          <h1 className="funnel-value-amount">$0</h1>
          <div className="funnel-value-comparison">
            <ChevronUp size={14} className="funnel-comparison-icon" />
            <span>0% vs Last 31 Days</span>
          </div>
        </div>
       
        {/* Stage indicators */}
        <div className="funnel-stage-indicators">
          <div className="funnel-stage-numbers">
            <div className="funnel-stage-number">0</div>
            <div className="funnel-stage-number">1</div>
            <div className="funnel-stage-number">2</div>
            <div className="funnel-stage-number">3</div>
          </div>
          <div className="funnel-tab-selectors">
            {["Cumulative", "Next Step Conversion"].map((tab) => (
              <div
                key={tab}
                className={`funnel-tab-item ${activeTab === tab ? "funnel-active-tab" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </div>
            ))}
          </div>
        </div>
      
        {/* Funnel visualization */}
        <div className="funnel-container">
          {/* Vertical Scrollbar */}
          <div className="funnel-vertical-scrollbar">
            <ChevronUp
              size={20}
              color="#ADB5BD"
              className="funnel-scroll-arrow"
              onClick={() => handleVerticalScroll("up")}
            />
            <div className="funnel-scrollbar-track">
              <div className="funnel-scrollbar-thumb" ref={verticalThumbRef}></div>
            </div>
            <ChevronDown
              size={20}
              color="#ADB5BD"
              className="funnel-scroll-arrow"
              onClick={() => handleVerticalScroll("down")}
            />
          </div>

          {/* Funnel stages - Now scrollable */}
          <div className="funnel-stages-wrapper">
            <div className="funnel-stages" ref={stagesContainerRef}>
              {/* Stage 1 */}
              <div className="funnel-stage">
                <div className="funnel-stage-info funnel-stage-info-primary">
                  <div className="funnel-stage-title">All Customers from House Call Pro</div>
                  <div className="funnel-stage-value">$0</div>
                </div>

                {/* Cumulative conversion */}
                <div className="funnel-conversion-indicator">
                  <div className="funnel-conversion-shape"></div>
                  <div className="funnel-conversion-text">100.00%</div>
                </div>

                {/* Next Step conversion */}
                <div className="funnel-conversion-indicator">
                  <div className="funnel-conversion-shape"></div>
                  <div className="funnel-conversion-text">100.00%</div>
                </div>
              </div>

              {/* Stage 2 */}
              <div className="funnel-stage">
                <div className="funnel-stage-info">
                  <div className="funnel-stage-title">Customer from DM and Job Value</div>
                  <div className="funnel-stage-value">$0</div>
                </div>

                {/* Cumulative conversion */}
                <div className="funnel-conversion-indicator">
                  <div className="funnel-conversion-shape"></div>
                  <div className="funnel-conversion-text">0.00%</div>
                </div>

                {/* Next Step conversion */}
                <div className="funnel-conversion-indicator">
                  <div className="funnel-conversion-shape"></div>
                  <div className="funnel-conversion-text">0.00%</div>
                </div>
              </div>

              {/* Stage 3 */}
              <div className="funnel-stage">
                <div className="funnel-stage-info">
                  <div className="funnel-stage-title">Won</div>
                  <div className="funnel-stage-value">$0</div>
                </div>

                {/* Cumulative conversion */}
                <div className="funnel-conversion-indicator">
                  <div className="funnel-conversion-shape"></div>
                  <div className="funnel-conversion-text">0.00%</div>
                </div>

                {/* Next Step conversion */}
                <div className="funnel-conversion-indicator">
                  <div className="funnel-conversion-shape"></div>
                  <div className="funnel-conversion-text">0.00%</div>
                </div>
              </div>

              {/* Additional stages for scrolling demonstration */}
              <div className="funnel-stage">
                <div className="funnel-stage-info">
                  <div className="funnel-stage-title">Follow-up</div>
                  <div className="funnel-stage-value">$0</div>
                </div>

                <div className="funnel-conversion-indicator">
                  <div className="funnel-conversion-shape"></div>
                  <div className="funnel-conversion-text">0.00%</div>
                </div>

                <div className="funnel-conversion-indicator">
                  <div className="funnel-conversion-shape"></div>
                  <div className="funnel-conversion-text">0.00%</div>
                </div>
              </div>

              <div className="funnel-stage">
                <div className="funnel-stage-info">
                  <div className="funnel-stage-title">Repeat Customer</div>
                  <div className="funnel-stage-value">$0</div>
                </div>

                <div className="funnel-conversion-indicator">
                  <div className="funnel-conversion-shape"></div>
                  <div className="funnel-conversion-text">0.00%</div>
                </div>

                <div className="funnel-conversion-indicator">
                  <div className="funnel-conversion-shape"></div>
                  <div className="funnel-conversion-text">0.00%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom scroll navigation */}
        <div className="funnel-bottom-scroll">
          <ChevronLeft
            size={24}
            color="#ADB5BD"
            className="funnel-scroll-arrow"
            onClick={() => handleHorizontalScroll("left")}
          />
          <div className="funnel-horizontal-scrollbar">
            <div className="funnel-scrollbar-thumb" ref={horizontalThumbRef}></div>
          </div>
          <ChevronRight
            size={24}
            color="#ADB5BD"
            className="funnel-scroll-arrow"
            onClick={() => handleHorizontalScroll("right")}
          />
        </div>
      </div>
    </div>
  )
}

export default SalesFunnelDashboard