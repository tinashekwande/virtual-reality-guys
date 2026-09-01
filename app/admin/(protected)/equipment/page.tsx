"use client"

import { useState, useEffect } from "react"
import {
  Glasses,
  ShieldCheck,
  AlertTriangle,
  Wrench,
  Plus,
  BatteryCharging,
  Tv,
  Wifi,
  Zap,
  Trash2,
  RefreshCw,
  Sliders,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import type { EquipmentItem, EquipmentLog } from "@/types/ai"

export default function EquipmentManagementPage() {
  const [equipment, setEquipment] = useState<EquipmentItem[]>([])
  const [logs, setLogs] = useState<EquipmentLog[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Form states
  const [name, setName] = useState("")
  const [serialNumber, setSerialNumber] = useState("")
  const [category, setCategory] = useState<EquipmentItem["category"]>("VR Headset")
  const [notes, setNotes] = useState("")

  const fetchEquipment = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/equipment")
      if (!res.ok) throw new Error("Failed to load equipment")
      const data = await res.json()
      setEquipment(data.equipment || [])
      setLogs(data.logs || [])
    } catch (err: any) {
      console.error("[EquipmentPage] Error:", err)
      toast.error("Could not load equipment inventory")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEquipment()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    try {
      const res = await fetch("/api/equipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          serial_number: serialNumber || `VRG-${Date.now().toString().slice(-4)}`,
          category,
          status: "available",
          usage_count: 0,
          battery_health: 100,
          notes,
        }),
      })
      if (!res.ok) throw new Error("Failed to add equipment")
      toast.success("Equipment item added to fleet!")
      setIsAddModalOpen(false)
      setName("")
      setSerialNumber("")
      setNotes("")
      fetchEquipment()
    } catch (err: any) {
      toast.error(err?.message || "Failed to create equipment")
    }
  }

  const handleToggleMaintenance = async (item: EquipmentItem) => {
    const nextStatus = item.status === "maintenance" ? "available" : "maintenance"
    try {
      const res = await fetch(`/api/equipment/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      })
      if (!res.ok) throw new Error("Failed to update status")
      toast.success(`Unit marked as ${nextStatus}`)
      fetchEquipment()
    } catch (err: any) {
      toast.error("Failed to update status")
    }
  }

  const filteredEquipment = equipment.filter(
    (item) => selectedCategory === "all" || item.category === selectedCategory
  )

  const totalHeadsets = equipment.filter((e) => e.category === "VR Headset").length
  const availableHeadsets = equipment.filter((e) => e.category === "VR Headset" && e.status === "available").length
  const maintenanceCount = equipment.filter((e) => e.status === "maintenance").length

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Glasses className="w-6 h-6 text-primary" />
            Equipment & Fleet Inventory
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            AI Fleet capacity engine, headset maintenance tracking, and spectator displays
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchEquipment} className="text-xs">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setIsAddModalOpen(true)} className="text-xs gap-1.5 bg-primary">
            <Plus className="w-4 h-4" />
            Add Equipment
          </Button>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground">Total VR Fleet</p>
          <p className="text-2xl font-bold text-foreground mt-1">{totalHeadsets} Headsets</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground">Available for Booking</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{availableHeadsets} Ready</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground">Under Maintenance</p>
          <p className={`text-2xl font-bold mt-1 ${maintenanceCount > 0 ? "text-amber-400" : "text-foreground"}`}>
            {maintenanceCount} Units
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground">Spectator Displays</p>
          <p className="text-2xl font-bold text-cyan-400 mt-1">
            {equipment.filter((e) => e.category === "Display/TV").length} TVs
          </p>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {["all", "VR Headset", "Display/TV", "Router", "Power & Cables", "Accessories"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-primary text-primary-foreground border-primary font-medium"
                : "bg-secondary/40 text-muted-foreground border-border hover:bg-secondary/80"
            }`}
          >
            {cat === "all" ? "All Equipment" : cat}
          </button>
        ))}
      </div>

      {/* Equipment Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-16 text-center text-muted-foreground text-xs">
            Loading equipment inventory...
          </div>
        ) : filteredEquipment.length === 0 ? (
          <div className="col-span-full py-16 text-center text-muted-foreground text-xs">
            No equipment items found in this category.
          </div>
        ) : (
          filteredEquipment.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border bg-card/80 transition-all flex flex-col justify-between gap-3 ${
                item.status === "maintenance"
                  ? "border-amber-500/40 bg-amber-500/5"
                  : "border-border/70 hover:border-primary/40"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-secondary text-primary">
                      {item.category === "VR Headset" ? (
                        <Glasses className="w-4 h-4" />
                      ) : item.category === "Display/TV" ? (
                        <Tv className="w-4 h-4" />
                      ) : item.category === "Router" ? (
                        <Wifi className="w-4 h-4" />
                      ) : (
                        <Zap className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground truncate">{item.name}</h4>
                      <p className="text-[11px] font-mono text-muted-foreground">{item.serial_number}</p>
                    </div>
                  </div>

                  <Badge
                    variant="outline"
                    className={`text-[10px] ${
                      item.status === "available"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : item.status === "maintenance"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {item.status.toUpperCase()}
                  </Badge>
                </div>

                {item.notes && (
                  <p className="text-xs text-muted-foreground mt-3 bg-secondary/30 p-2 rounded-lg">
                    {item.notes}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-border/40 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Usage: {item.usage_count} events</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleToggleMaintenance(item)}
                  className="h-7 px-2.5 text-xs gap-1 border-border"
                >
                  <Wrench className="w-3 h-3 text-muted-foreground" />
                  {item.status === "maintenance" ? "Mark Ready" : "Flag Maintenance"}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-lg text-foreground">Add Equipment Item</h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-muted-foreground mb-1">Item Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Meta Quest 3 Headset #09"
                  required
                  className="w-full bg-secondary/40 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-muted-foreground mb-1">Serial Number / Asset Tag</label>
                <input
                  type="text"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  placeholder="e.g. VRG-Q3-009"
                  className="w-full bg-secondary/40 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-muted-foreground mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-secondary/40 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="VR Headset">VR Headset</option>
                  <option value="Display/TV">Display/TV</option>
                  <option value="Router">Router</option>
                  <option value="Power & Cables">Power & Cables</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div>
                <label className="block text-muted-foreground mb-1">Notes / Accessories</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Kiwi Elite Comfort Strap attached"
                  rows={2}
                  className="w-full bg-secondary/40 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-primary">
                  Save Equipment
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
